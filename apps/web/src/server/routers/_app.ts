import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Event, prisma } from '@shared/database';
import sortRounds from '@src/utils/sort-rounds';
import getStatistics, { getAvg } from '@src/utils/get-statistics';
import datasetRouter from './dataset';
import teamRouter from './team';
import judgeRouter from './judge';
import featureRouter from './feature';

export const appRouter = router({
  dataset: datasetRouter,
  team: teamRouter,
  judge: judgeRouter,
  feature: featureRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;