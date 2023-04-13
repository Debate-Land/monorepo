import { Router } from "express";
import roundSpeakingRouter from './round';
import tournamentSpeakingRouter from './tournament';

const speakingRouter = Router();

speakingRouter.use('/rounds', roundSpeakingRouter);
speakingRouter.use('/tournaments', tournamentSpeakingRouter);

export default speakingRouter;
