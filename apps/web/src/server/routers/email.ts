import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Handlers } from '@shared/email';
import { EmailSubscriber } from '@shared/database';

const emailRouter = router({
  subscribe: procedure
    .input(z.object({
      email: z.string(),
      teamId: z.string().optional(),
      judgeId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const existingSubscriber = await prisma.emailSubscriber.findUniqueOrThrow({
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

      const confirmationEmails: any[] = [];

      let subscriber: EmailSubscriber;

      if (existingSubscriber) {
        subscriber = await prisma.emailSubscriber.update({
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
            }),
            ...(input.judgeId && {
              judges: {
                connect: {
                  id: input.judgeId
                }
              }
            })
          }
        });
      } else {
        subscriber = await prisma.emailSubscriber.create({
          data: {
            email: input.email,
            ...(input.teamId && {
              teams: {
                connect: {
                  id: input.teamId
                }
              }
            }),
            ...(input.judgeId && {
              judges: {
                connect: {
                  id: input.judgeId
                }
              }
            }),
          }
        });
        const mailingListSub = await Handlers.Subscriber({
          subscriberId: subscriber.id,
          type: "mailing list",
          action: "subscribed"
        });
        confirmationEmails.push(mailingListSub);
      }

      const transactionalSub = await Handlers.Subscriber({
        subscriberId: subscriber.id,
        type,
        id: targetId,
        action: "subscribed"
      });
      confirmationEmails.push(transactionalSub);

      return {
        subscriber,
        confirmationEmails
      };
    }),
  unsubscribe: procedure
    .input(z.object({
      email: z.string(),
      teamId: z.string().optional(),
      judgeId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      let type: "judge" | "team" | "mailing list";

      if (input.teamId) {
        type = "team";
      } else if (input.judgeId) {
        type = "judge";
      } else {
        type = "mailing list";
      }

      if (type === "team") {
        const subscriber = await prisma.emailSubscriber.update({
          where: {
            email: input.email
          },
          data: {
            teams: {
              disconnect: {
                id: input.teamId
              }
            }
          },
        });
      } else if (type === "judge") {
        return prisma.emailSubscriber.update({
          where: {
            email: input.email
          },
          data: {
            judges: {
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
