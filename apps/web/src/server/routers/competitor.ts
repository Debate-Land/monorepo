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
              aliases: {
                take: 1
              },
              circuits: true,
              seasons: true,
              _count: {
                select: {
                  results: true
                },
              }
            }
          },
          roundSpeakerResults: true,
          name: true
        }
      });

      return competitor;
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
        select: {
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
                      },
                    }
                  }
                }
              },
            }
          },
          decision: true,
          avgSpeakerPoints: true
        },
      });

      return sortRecords<typeof records[0]>(records);
    })
});

export default competitorRouter;
