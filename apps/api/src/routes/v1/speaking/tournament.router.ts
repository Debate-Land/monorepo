import { prisma, TournamentSpeakerResult } from "@shared/database";
import restHandler, { PrismaModel } from "../../../utils/rest-handler";

export default restHandler<TournamentSpeakerResult>(
  prisma.tournamentSpeakerResult as PrismaModel<TournamentSpeakerResult>,
  // [auth, rateLimiter, usage]
);
