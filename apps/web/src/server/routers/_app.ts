import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Event, prisma } from '@shared/database';
import sortRounds from '@src/utils/sort-rounds';
import getStatistics, { getAvg } from '@src/utils/get-statistics';
import datasetRouter from './dataset';
import teamRouter from './team';

export const appRouter = router({
  dataset: datasetRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;