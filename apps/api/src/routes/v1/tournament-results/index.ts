import { Router } from "express";
import teamResultRouter from './team';
import judgeResultRouter from './judge';

const tournamentResultRouter = Router();

tournamentResultRouter.use('/teams', teamResultRouter);
tournamentResultRouter.use('/judges', judgeResultRouter);

export default tournamentResultRouter;
