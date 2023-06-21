import { Router } from "express";
import teamResultRouter from './team.router';
import judgeResultRouter from './judge.router';

const resultRouter = Router();

resultRouter.use('/teams', teamResultRouter);
resultRouter.use('/judges', judgeResultRouter);

export default resultRouter;
