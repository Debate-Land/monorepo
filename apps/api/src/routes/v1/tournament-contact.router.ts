import { prisma, TournamentContact } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<TournamentContact>(
  prisma.tournamentContact as PrismaModel<TournamentContact>,
  // [auth, rateLimiter, usage]
);
