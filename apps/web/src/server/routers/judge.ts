import { z } from 'zod';
import { procedure, router } from '../trpc';
import sortRecords from '@src/utils/sort-records';

const judgeRouter = router({
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
      const [judge, ranking] = await Promise.all([
        prisma.judge.findUnique({
          where: {
            id: input.id
          },
          include: {
            results: {
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
                }
              },
              include: {
                tournament: {
                  select: {
                    name: true,
                    start: true,
                  }
                }
              },
              orderBy: {
                tournament: {
                  start: "asc"
                }
              }
            },
            rankings: {
              include: {
                season: true,
                circuit: {
                  select: {
                    id: true,
                    name: true,
                    event: true
                  }
                },
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
            _count: {
              select: {
                records: true
              }
            }
          }
        }),
        input.circuit && input.season
          ? prisma.judgeRanking.findUnique({
            where: {
              judgeId_circuitId_seasonId: {
                judgeId: input.id,
                circuitId: input.circuit,
                seasonId: input.season
              }
            },
            select: {
              index: true
            }
          })
          : null
      ]);

      return judge
        ? {
          ...judge,
          ...(ranking && { index: ranking.index })
        }
        : undefined
    }),
  records: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const records = await prisma.judgeRecord.findMany({
        where: {
          resultId: input.id
        },
        include: {
          rounds: {
            include: {
              speaking: {
                include: {
                  competitor: true
                }
              },
              result: {
                select: {
                  team: {
                    include: {
                      aliases: {
                        select: {
                          code: true
                        },
                        take: 1
                      }
                    }
                  }
                }
              }
            }
          }
        },
      });

      return sortRecords<typeof records[0]>(records);
    })
});

export default judgeRouter;
