import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Circuit, Event, Season, prisma } from '@shared/database';

type EventDetails = {
  [key in Event]: (Circuit & {
    seasons: Season[];
  })[];
};

const featureRouter = router({
  compass: procedure
    .query(async () => {
      const events = (await prisma.circuit.groupBy({
        by: ["event"]
      })).map(e => e.event);

      let eventDetails: any = {};

      for (let i = 0; i < events.length; i++) {
        const eventCircuits = await prisma.circuit.findMany({
          where: {
            event: events[i]
          },
          include: {
            seasons: true
          }
        });

        eventDetails[events[i]] = eventCircuits;
      }

      return eventDetails as EventDetails;
    }),
});

export default featureRouter;
