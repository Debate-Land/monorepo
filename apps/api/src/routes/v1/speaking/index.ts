import { Router } from "express";
import roundSpeakingRouter from './round.router';
import tournamentSpeakingRouter from './tournament.router';

const speakingRouter = Router();

speakingRouter.use('/rounds', roundSpeakingRouter);
speakingRouter.use('/tournaments', tournamentSpeakingRouter);

export default speakingRouter;
