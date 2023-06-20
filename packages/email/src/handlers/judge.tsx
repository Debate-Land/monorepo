import { prisma } from '@shared/database';
import resend from '../services/resend';
import { TransactionalUpdateEmail } from '../emails';
import React from 'react';

const Judge = async (id: string) => {
  const judge = await prisma.judge.findUniqueOrThrow({
    where: {
      id
    },
    select: {
      name: true,
      subscribers: {
        select: {
          email: true
        }
      }
    }
  });

  judge.subscribers.forEach(({ email }) => {
    resend.sendEmail({
      from: 'Debate Land Updates <mail@updates.debate.land>',
      to: email,
      subject: `Update for ${judge.name} on Debate Land.`,
      reply_to: 'support@debate.land',
      react: <TransactionalUpdateEmail
        updateTarget={judge.name}
        actionUrl={`https://debate.land/teams/${id}`}
        unsubscribe={{
          type: "team",
          id: id,
          email: email,
        }}
      />
    })
  });
};

export default Judge;