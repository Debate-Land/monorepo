import { Router } from "express";
import teamResultRouter from './team';
import judgeResultRouter from './judge';

const resultRouter = Router();

resultRouter.use('/teams', teamResultRouter);
resultRouter.use('/judges', judgeResultRouter);

export default resultRouter;
