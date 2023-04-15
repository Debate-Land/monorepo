import { router } from '../trpc';
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