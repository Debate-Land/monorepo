import { prisma, TeamTournamentResult } from "@shared/database";
import restHandler, { PrismaModel } from "../../../utils/rest-handler";

export default restHandler<TeamTournamentResult>(
  prisma.teamTournamentResult as PrismaModel<TeamTournamentResult>,
  // [auth, rateLimiter, usage]
);
