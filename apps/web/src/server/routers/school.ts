import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Event } from '@shared/database';

const schoolRouter = router({
  summary: procedure
    .input(
      z.object({
        id: z.number(),
        season: z.number().optional(),
        circuit: z.number().optional(),
        event: z.string().refine((data) => Object.values(Event).includes(data as Event)),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
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

export default schoolRouter;
