import { Router } from "express";
import aliasRouter from "./alias";
import bidRouter from './bid';
import circuitRankingRouter from "./circuit-ranking.router";
import circuitRouter from "./circuit.router";
import competitorRouter from "./competitor.router";
import judgeRecordRouter from "./judge-record.router";
import judgeRouter from "./judge.router";
import roundSpeakerResultRouter from "./round-speaker-result.router";
import roundRouter from "./round.router";
import seasonRouter from "./season.router";
import teamRouter from "./team.router";
import tournamentResultRouter from "./tournament-results";
import tournamentRouter from "./tournament.router";
import tournamentSpeakerResultRouter from "./tournament-speaker-result.router";

const coreV1Router = Router();

coreV1Router.use('/circuit-rankings', circuitRankingRouter);
coreV1Router.use('/circuits', circuitRouter);
coreV1Router.use('/competitors', competitorRouter);
coreV1Router.use('/aliases', aliasRouter);
coreV1Router.use('/bids', bidRouter);
coreV1Router.use('/teams', teamRouter);
coreV1Router.use('/judge-records', judgeRecordRouter);
coreV1Router.use('/judges', judgeRouter);
coreV1Router.use('/rounds', roundRouter);
coreV1Router.use('/round-speaker-results', roundSpeakerResultRouter);
coreV1Router.use('/seasons', seasonRouter);
coreV1Router.use('/tournament-results', tournamentResultRouter);
coreV1Router.use('/tournament-speaker-results', tournamentSpeakerResultRouter);
coreV1Router.use('/tournaments', tournamentRouter);

export default coreV1Router;
