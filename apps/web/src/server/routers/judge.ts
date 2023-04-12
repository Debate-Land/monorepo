import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Event, prisma } from '@shared/database';

const judgeRouter = router({
  summary: procedure
    .input(
      z.object({
        id: z.string(),
        season: z.number().optional(),
        circuit: z.number().optional(),
        event: z.string().refine((data) => Object.values(Event).includes(data as Event)),
      })
    )
    .query(async ({ input }) => {
      let judge = await prisma.judge.findUnique({
        where: {
          id: input.id
        },
        include: {
          records: {
            where: {
              tournament: {
                circuits: {
                  some: {
                    id: {
                      equals: input.circuit
                    }
                  }
                },
                seasonId: {
                  equals: input.season
                }
              }
            },
            include: {
              rounds: {
                include: {
                  speaking: {
                    include: {
                      competitor: {
                        select: {
                          name: true
                        }
                      }
                    }
                  },
                }
              },
              teams: {
                select: {
                  aliases: {
                    select: {
                      code: true,
                    },
                    take: 1
                  },
                  id: true
                }
              },
              tournament: {
                select: {
                  name: true,
                  start: true
                }
              }
            }
          },
        }
      });

      return judge;
    }),
});

export default judgeRouter;
