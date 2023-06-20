import { z } from 'zod';
import { procedure, router } from '../trpc';

const emailRouter = router({
  subscribe: procedure
    .input(z.object({
      email: z.string().email(),
      teamId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      return prisma.emailSubscriber.upsert({
        where: {
          email: input.email
        },
        update: {
          ...(input.teamId && {
            teams: {
              connect: {
                id: input.teamId
              }
            }
          })
        },
        create: {
          email: input.email,
          ...(input.teamId && {
            teams: {
              connect: {
                id: input.teamId
              }
            }
          })
        }
      });
    }),
  unsubscribe: procedure
    .input(z.object({
      email: z.string().email(),
      teamId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      if (input.teamId) {
        return prisma.emailSubscriber.update({
          where: {
            email: input.email
          },
          data: {
            teams: {
              disconnect: {
                id: input.teamId
              }
            }
          }
        });
      } else {
        return prisma.emailSubscriber.delete({
          where: {
            email: input.email
          }
        });
      }
    })
});

export default emailRouter;
