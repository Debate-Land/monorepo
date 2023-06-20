import { prisma } from '@shared/database';
import resend from '../services/resend';
import { TransactionalUpdateEmail } from '../emails';
import React from 'react';

const Team = async (id: string) => {
  const team = await prisma.team.findUniqueOrThrow({
    where: {
      id
    },
    select: {
      aliases: {
        take: 1,
        select: {
          code: true
        }
    },
      subscribers: {
        select: {
          email: true
        }
      }
    }
  });
  const code = team.aliases[0].code;

  await Promise.all(team.subscribers.map(({ email }) => (
    resend.sendEmail({
      from: 'Debate Land Updates <mail@updates.debate.land>',
      to: email,
      subject: `Update for ${code} on Debate Land.`,
      reply_to: 'support@debate.land',
      react: <TransactionalUpdateEmail
        updateTarget={code}
        actionUrl={`https://debate.land/teams/${id}`}
        unsubscribe={{
          type: "team",
          id: id,
          email: email,
        }}
      />
    })
  )));
};

export default Team;