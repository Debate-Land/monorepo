import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Circuit, Event, Season } from '@shared/database';
import { HeadToHeadRound } from '@src/components/tables/head-to-head-rounds';

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
              ...(input.circuit && {
                circuits: {
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
  teamSearch: procedure
    .input(
      z.object({
        search: z.string(),
        event: z.string(),
        season: z.number(),
        circuit: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const results = await prisma.alias.findMany({
        where: {
          code: {
            search: input.search
          },
          team: {
            results: {
              some: {
                tournament: {
                  event: input.event as Event,
                  seasonId: input.season,
                  circuits: {
                    some: {
                      id: input.circuit
                    }
                  }
                }
              }
            }
          }
        },
        select: {
          code: true,
          id: true,
          teamId: true,
        },
        take: 10
      });

      return results;
    }),
  headToHead: procedure
    .input(
      z.object({
        event: z.string(),
        circuit: z.number(),
        season: z.number(),
        team1: z.string(),
        team2: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const getRanking = (teamId: string) => (
        prisma.teamRanking.findUniqueOrThrow({
          where: {
            teamId_circuitId_seasonId: {
              teamId: teamId,
              circuitId: input.circuit,
              seasonId: input.season
            }
          },
          include: {
            team: {
              select: {
                aliases: {
                  select: {
                    code: true
                  },
                  take: 1
                }
              }
            }
          }
        })
      );

      const team1Ranking = await getRanking(input.team1);
      const team2Ranking = await getRanking(input.team2);

      const delta = team1Ranking.otr - team2Ranking.otr;

      const getRounds = (teamId: string) => (
        prisma.round.findMany({
          where: {
            result: {
              teamId
            },
            opponent: {
              isNot: null
            }
          },
          select: {
            opponent: {
              select: {
                rankings: true,
                aliases: {
                  select: {
                    code: true
                  },
                  take: 1
                }
              }
            },
            result: {
              select: {
                tournament: {
                  select: {
                    start: true,
                    circuits: {
                      select: {
                        id: true
                      }
                    },
                    seasonId: true
                  },
                }
              }
            },
            outcome: true
          },
        }).then(rounds => Promise.all(rounds.map(async round => {
          const { otr: opponentOtr, circuitId, seasonId } = round.opponent!.rankings.find(r => (
            round.result.tournament.circuits.map(c => c.id).includes(r.circuitId)
            && round.result.tournament.seasonId === r.seasonId
          ))!;

          const { otr } = await prisma.teamRanking.findUniqueOrThrow({
            where: {
              teamId_circuitId_seasonId: {
                teamId,
                circuitId,
                seasonId
              }
            }
          });

          return {
            opponent: round.opponent!.aliases[0],
            date: round.result.tournament.start,
            outcome: round.outcome,
            opponentOtr,
            otr
          }
        })))
      );

      const team1Rounds = (await getRounds(input.team1))
        .map(round => {
          const roundDelta = team1Ranking.otr - round.opponentOtr;
          if (roundDelta >= delta && delta > 0) {
            // Favored to win by same margin or more
            return round;
          } else if (roundDelta <= delta && delta < 0) {
            // Predicted to lose by the same margin or more
            return round;
          }
          return null;
        })
        .filter(round => round !== null) as HeadToHeadRound[];
      const team2Rounds = (await getRounds(input.team2))
        .map(round => {
          const roundDelta = team2Ranking.otr - round.opponentOtr;
          if (roundDelta >= delta && delta > 0) {
            // Favored to win by same margin or more
            return round;
          } else if (roundDelta <= delta && delta < 0) {
            // Predicted to lose by the same margin or more
            return round;
          }
          return null;
        })
        .filter(round => round !== null) as HeadToHeadRound[];

      return {
        team1: {
          rounds: team1Rounds,
          ranking: team1Ranking
        },
        team2: {
          rounds: team2Rounds,
          ranking: team2Ranking
        },
      };
    })
});

export default featureRouter;
