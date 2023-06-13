import { router } from '../trpc';
import datasetRouter from './dataset';
import teamRouter from './team';
import judgeRouter from './judge';
import featureRouter from './feature';
import feedbackRouter from './feedbackRouter';
import competitorRouter from './competitor';

export const appRouter = router({
  dataset: datasetRouter,
  team: teamRouter,
  judge: judgeRouter,
  feature: featureRouter,
  feedback: feedbackRouter,
  competitor: competitorRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;