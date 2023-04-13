import { Router } from "express";
import teamRankingRouter from './team';
import judgeRankingRouter from './judge';

const rankingRouter = Router();

rankingRouter.use('/teams', teamRankingRouter);
rankingRouter.use('/judges', judgeRankingRouter);

export default rankingRouter;
