import { router } from '../trpc';
import datasetRouter from './dataset';
import teamRouter from './team';
import judgeRouter from './judge';
import featureRouter from './feature';
import issueRouter from './issueRouter';

export const appRouter = router({
  dataset: datasetRouter,
  team: teamRouter,
  judge: judgeRouter,
  feature: featureRouter,
  issue: issueRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;