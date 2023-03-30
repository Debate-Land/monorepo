import { z } from 'zod';
import { procedure, router } from '../trpc';
import { prisma } from '@shared/database';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tournament = await prisma.tournament.findFirst({
        select: {
          name: true,
        }
      });
      return {
        greeting: `hello ${tournament ? tournament.name : 'no tournament :('}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;