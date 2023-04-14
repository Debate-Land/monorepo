import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Event, prisma } from '@shared/database';

const featureRouter = router({
  circuits: procedure
    .input(
      z.object({
        event: z.string().refine((data) => Object.values(Event).includes(data as Event)),
      })
    )
    .query(async ({ input }) => {
      return await prisma.circuit.findMany({
        where: {
          event: input.event as Event
        }
      });
    }),
  seasons: procedure
    .input(
      z.object({
        circuit: z.number()
      })
    )
    .query(async ({ input }) => {
      return await prisma.circuit.findUnique({
        where: {
          id: input.circuit
        },
        select: {
          seasons: true
        }
      });
    })
});

export default featureRouter;
