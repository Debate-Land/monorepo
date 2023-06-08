import { z } from 'zod';
import { procedure, router } from '../trpc';
import sortRounds from '@src/utils/sort-rounds';
import getStatistics from '@src/utils/get-statistics';

const teamRouter = router({
  summary: procedure
    .input(
      z.object({
        id: z.string(),
        season: z.number().optional(),
        circuit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      let team = await prisma.team.findUnique({
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
              bid: {
                select: {
                  value: true,
                  isGhostBid: true
                }
              },
              alias: true,
              school: true,
              speaking: {
                include: {
                  competitor: {
                    select: {
                      name: true
                    }
                  }
                }
              },
            },
            where: {
              tournament: {
                ...(input.circuit && {
                  circuits: {
                    some: {
                      id: {
                        equals: input.circuit
                      }
                    }
                  }
                }),
                ...(input.season && {
                  seasonId: {
                    equals: input.season
                  }
                }),
              },
            },
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
              ...(input.circuit && {
                circuit: {
                  id: {
                    equals: input.circuit
                  }
                }
              }),
              ...(input.season && {
                seasonId: {
                  equals: input.season
                }
              }),
            }
          },
          circuits: {
            select: {
              name: true,
              event: true,
              id: true,
            }
          },
          seasons: true,
          _count: {
            select: {
              rounds: true
            }
          }
        }
      });
      if (team) {
        return { ...team, statistics: getStatistics(team) }
      }
      return null;
    }),
  rounds: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const rounds = await prisma.round.findMany({
        where: {
          resultId: input.id
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
          records: {
            select: {
              decision: true,
              judge: true,
            }
          },
          speaking: {
            include: {
              competitor: true,
            }
          }
        }
      });

      if (rounds) {
        return sortRounds<typeof rounds[0]>(rounds);
      }

      return rounds;
    }),
});

export default teamRouter;
