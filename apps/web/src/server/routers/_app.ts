import { router } from '../trpc';
import datasetRouter from './dataset';
import teamRouter from './team';
import judgeRouter from './judge';
import featureRouter from './feature';
import feedbackRouter from './feedbackRouter';
import competitorRouter from './competitor';
import emailRouter from './email';
import scrapingRouter from './scraping';

export const appRouter = router({
  dataset: datasetRouter,
  team: teamRouter,
  judge: judgeRouter,
  feature: featureRouter,
  feedback: feedbackRouter,
  competitor: competitorRouter,
  email: emailRouter,
  scraping: scrapingRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;