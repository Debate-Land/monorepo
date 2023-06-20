import { Router } from "express";
import teamRankingRouter from './team.router';
import judgeRankingRouter from './judge.router';

const rankingRouter = Router();

rankingRouter.use('/teams', teamRankingRouter);
rankingRouter.use('/judges', judgeRankingRouter);

export default rankingRouter;
