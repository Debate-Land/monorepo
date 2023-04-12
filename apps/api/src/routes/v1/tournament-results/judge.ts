import { prisma, JudgeTournamentResult } from "@shared/database";
import restHandler, { PrismaModel } from "../../../utils/rest-handler";

export default restHandler<JudgeTournamentResult>(
  prisma.judgeTournamentResult as PrismaModel<JudgeTournamentResult>,
  // [auth, rateLimiter, usage]
);
