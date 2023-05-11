import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Circuit, Event, Season } from '@shared/database';

type EventDetails = {
  [key in Event]: (Circuit & {
    seasons: Season[];
  })[];
};

interface Result {
  name: string;
  id: string | number;
  type: "Team" | "Competitor" | "Judge" | "Tournament";
}

const featureRouter = router({
  compass: procedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const { prisma } = ctx;
      const events = (await prisma.circuit.groupBy({
        by: ["event"]
      })).map(e => e.event);

      let eventDetails: any = {};

      for (let i = 0; i < events.length; i++) {
        const eventCircuits = await prisma.circuit.findMany({
          where: {
            event: events[i]
          },
          include: {
            seasons: true
          }
        });

        eventDetails[events[i]] = eventCircuits;
      }

      return eventDetails as EventDetails;
    }),
  search: procedure
    .input(
      z.object({
        query: z.string().min(3).max(32),
        season: z.number().optional(),
        circuit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const data = await Promise.all([
        prisma.alias.findMany({
          where: {
            code: {
              search: input.query
            },
            team: {
              ...(input.season && {
                seasons: {
                  some: {
                    id: input.season
                  }
                }
              }),
              ...(input.circuit && { circuits: {
                some: {
                  id: input.circuit
                }
              }
            }),
            }
          },
          select: {
            code: true,
            teamId: true,
          }
        }),
        prisma.competitor.findMany({
          where: {
            name: {
              search: input.query
            },
            teams: {
              some: {
                ...(input.season && {
                  seasons: {
                    some: {
                      id: input.season
                    }
                  }
                }),
                ...(input.circuit && {
                  circuits: {
                    some: {
                      id: input.circuit
                    }
                  }
                })
              }
            }
          },
          select: {
            name: true,
            id: true
          }
        }),
        prisma.judge.findMany({
          where: {
            name: {
              search: input.query
            },
            results: {
              some: {
                tournament: {
                  ...(input.season && {
                    seasonId: input.season
                  }),
                  ...(input.circuit && {
                    circuits: {
                      some: {
                        id: {
                          equals: input.circuit
                        }
                      }
                    }
                  })
                }
              }
            }
          },
          select: {
            name: true,
            id: true,
          }
        }),
        prisma.tournament.findMany({
          where: {
            name: {
              search: input.query
            },
            ...(input.season && {
              seasonId: input.season
            }),
            ...(input.circuit && {
              circuits: {
                some: {
                  id: {
                    equals: input.circuit
                  }
                }
              }
            })
          },
          select: {
            name: true,
            id: true,
          }
        })
      ]);

      let results: Result[] = [];

      data[0].forEach(team => results.push({
        name: team.code,
        id: team.teamId,
        type: 'Team'
      }));

      data[1].forEach(competitor => results.push({
        name: competitor.name,
        id: competitor.id,
        type: 'Competitor'
      }));

      data[2].forEach(judge => results.push({
        name: judge.name,
        id: judge.id,
        type: 'Judge'
      }));

      data[3].forEach(tournament => results.push({
        name: tournament.name,
        id: tournament.id,
        type: 'Tournament'
      }));

      return results;
    }),
});

export default featureRouter;
