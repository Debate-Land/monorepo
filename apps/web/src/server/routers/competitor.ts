import { z } from 'zod';
import { procedure, router } from '../trpc';
import sortRecords from '@src/utils/sort-records';

const competitorRouter = router({
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

      const competitor = await prisma.competitor.findUniqueOrThrow({
        where: {
          id: input.id
        },
        select: {
          teams: {
            select: {
              id: true,
              aliases: {
                take: 1
              },
              circuits: {
                include: {
                  seasons: true
                }
              },
              seasons: true,
              _count: {
                select: {
                  results: true
                },
              }
            },
            where: {
              results: {
                some: {
                  tournament: {
                    ...(input.season && {
                      seasonId: input.season
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
              }
            }
          },
          roundSpeakerResults: {
            where: {
              round: {
                result: {
                  tournament: {
                    ...(input.season && {
                      seasonId: input.season
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
              }
            }
          },
          name: true
        }
      });

      return competitor;
    })
});

export default competitorRouter;
