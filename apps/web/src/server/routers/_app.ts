import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Event, prisma } from '@shared/database';

export const appRouter = router({
  team: procedure
    .input(
      z.object({
        id: z.string(),
        seasons: z.array(z.number()).optional(),
        circuits: z.array(z.number()).optional(),
        event: z.string().refine((data) => Object.values(Event).includes(data as Event)),
      })
    )
    .query(async ({ input }) => {
      const team = await prisma.team.findUnique({
        where: {
          id: input.id,
        },
        include: {
          competitors: true,
          results: {
            include: {
              tournament: {
                include: {
                  circuits: true
                }
              },
              alias: true,
              school: true,
              speaking: true,
            },
            where: {
              tournament: {
                event: {
                  equals: input.event as Event
                },
                ...(input.circuits && {
                  circuits: {
                    some: {
                      id: {
                        in: input.circuits
                      }
                    }
                  }
                }),
                ...(input.seasons && {
                  seasonId: {
                    in: input.seasons
                  }
                }),
              },
            }
          },
          aliases: {
            take: 1,
            select: {
              code: true,
            }
          },
          rankings: {
            include: {
              season: true,
              circuit: true,
            },
            where: {
              ...(input.circuits && {
                circuit: {
                  id: {
                    in: input.circuits
                  },
                  event: {
                    in: input.event as Event
                  }
                }
              }),
              ...(input.seasons && {
                seasonId: {
                  in: input.seasons
                }
              }),
            }
          },
          circuits: true,
          seasons: true,
        }
      });

      return team;
    }),
  rounds: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(async ({ input }) => {
      const rounds = await prisma.round.findMany({
        where: {
          tournamentResultId: input.id
        },
        include: {
          opponent: {
            select: {
              aliases: {
                take: 1
              },
              id: true,
            }
          },
          judgeRecords: {
            select: {
              decision: true,
              tabJudgeId: true,
              judge: true
            }
          },
          speaking: true
        }
      });

      return rounds;
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;