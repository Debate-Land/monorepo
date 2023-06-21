import { prisma } from '@shared/database';
import resend from '../services/resend';
import { SubscriptionConfirmationEmail, TransactionalUpdateEmail } from '../emails';
import React from 'react';

interface SubscriberProps {
  subscriberId: number;
  id?: string;
  type: "judge" | "team" | "mailing list";
  action: "subscribed" | "unsubscribed";
}

const Subscriber = async ({ subscriberId, id, type, action }: SubscriberProps) => {
  const { email } = await prisma.emailSubscriber.findUniqueOrThrow({
    where: {
      id: subscriberId
    },
    select: {
      email: true
    }
  });

  let target: string | undefined;

  switch (type) {
    case "team":
      const team = await prisma.team.findUniqueOrThrow({
        where: {
          id
        },
        select: {
          aliases: {
            take: 1
          }
        }
      });
      target = team.aliases[0].code as string;
      break;

    case "judge":
      const judge = await prisma.judge.findUniqueOrThrow({
        where: {
          id
        },
        select: {
          name: true
        }
      });
      target = judge.name;
      break;
    default:
      target = undefined;
      break;
  }

  return resend.sendEmail({
    from: 'Debate Land Updates <mail@updates.debate.land>',
    to: email,
    subject: `You\'ve  ${action} to ${target || "our mailing list"} successfully.`,
    reply_to: 'support@debate.land',
    react: <SubscriptionConfirmationEmail
      updateTarget={target}
      action={action}
      unsubscribe={{
        type,
        id,
        email,
      }}
    />
  })
};

export default Subscriber;