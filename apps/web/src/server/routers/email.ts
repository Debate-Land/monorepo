import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Handlers } from '@shared/email';

const emailRouter = router({
  subscribe: procedure
    .input(z.object({
      email: z.string(),
      teamId: z.string().optional(),
      judgeId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const subscriber = await prisma.emailSubscriber.findUnique({
        where: {
          email: input.email
        }
      });

      let type: "judge" | "team" | "mailing list";
      let targetId: string | undefined;

      if (input.teamId) {
        type = "team";
        targetId = input.teamId
      } else if (input.judgeId) {
        type = "judge";
        targetId = input.judgeId;
      } else {
        type = "mailing list";
      }

      let id: number;

      if (subscriber) {
        const updatedSubscriber = await prisma.emailSubscriber.update({
          where: {
            email: input.email
          },
          data: {
            ...(input.teamId && {
              teams: {
                connect: {
                  id: input.teamId
                }
              }
            })
          }
        });
        id = updatedSubscriber.id;
      } else {
        const newSubscriber = await prisma.emailSubscriber.create({
          data: {
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
        id = newSubscriber.id;
        await Handlers.Subscriber({
          subscriberId: id,
          type: "mailing list",
          action: "subscribed"
        });
      }

      await Handlers.Subscriber({
        subscriberId: id,
        type,
        id: targetId,
        action: "subscribed"
      });
    }),
  unsubscribe: procedure
    .input(z.object({
      email: z.string(),
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
