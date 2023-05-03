import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Circuit, Event, Season, prisma } from '@shared/database';

type EventDetails = {
  [key in Event]: (Circuit & {
    seasons: Season[];
  })[];
};

interface Result {
  name: string;
  id: string | number;
  type: "Team" | "Competitor";
}

const featureRouter = router({
  compass: procedure
    .input(z.object({}))
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
  search: procedure
    .input(
      z.object({
        query: z.string().min(3).max(32),
      })
    )
    .query(async ({ input }) => {
      const data = await Promise.all([
        prisma.alias.findMany({
          where: {
            code: {
              search: input.query
            }
          },
          select: {
            code: true,
            teamId: true,
          }
        }),
        prisma.competitor.findMany({
          where: {
            name: {
              search: input.query
            }
          },
          select: {
            name: true,
            id: true
          }
        }),
      ]);

      let results: Result[] = [];

      data[0].forEach(team => results.push({
        name: team.code,
        id: team.teamId,
        type: 'Team'
      }));

      data[1].forEach(competitor => results.push({
        name: competitor.name,
        id: competitor.id,
        type: 'Competitor'
      }));

      return results;
    }),
});

export default featureRouter;
