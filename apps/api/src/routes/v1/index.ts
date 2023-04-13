import { Router } from "express";
import aliasRouter from "./alias";
import bidRouter from './bid';
import circuitRouter from "./circuit.router";
import competitorRouter from "./competitor.router";
import judgeRecordRouter from "./judge-record.router";
import judgeRouter from "./judge.router";
import rankingRouter from "./rankings";
import roundRouter from "./round.router";
import seasonRouter from "./season.router";
import speakingRouter from "./speaking";
import teamRouter from "./team.router";
import tournamentResultRouter from "./results";
import tournamentRouter from "./tournament.router";

const coreV1Router = Router();

coreV1Router.use('/rankings', rankingRouter);
coreV1Router.use('/circuits', circuitRouter);
coreV1Router.use('/competitors', competitorRouter);
coreV1Router.use('/aliases', aliasRouter);
coreV1Router.use('/bids', bidRouter);
coreV1Router.use('/teams', teamRouter);
coreV1Router.use('/judge-records', judgeRecordRouter);
coreV1Router.use('/judges', judgeRouter);
coreV1Router.use('/rounds', roundRouter);
coreV1Router.use('/seasons', seasonRouter);
coreV1Router.use('/speaking', speakingRouter);
coreV1Router.use('/results', tournamentResultRouter);
coreV1Router.use('/tournaments', tournamentRouter);

export default coreV1Router;
