import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Event, prisma } from '@shared/database';
import sortRecords from '@src/utils/sort-records';

const judgeRouter = router({
  summary: procedure
    .input(
      z.object({
        id: z.number(),
        season: z.number().optional(),
        circuit: z.number().optional(),
        event: z.string().refine((data) => Object.values(Event).includes(data as Event)),
      })
    )
    .query(async ({ input }) => {
      const school = await prisma.school.findUnique({
        where: {
          id: input.id
        },
        include: {
          teams: {
            where: {
              results: {
                some: {
                  tournament: {
                    circuits: {
                      some: {
                        id: {
                          equals: input.circuit
                        }
                      }
                    },
                    season: {
                      id: {
                        equals: input.season
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
    }),
  records: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(async ({ input }) => {
    })
});

export default judgeRouter;
