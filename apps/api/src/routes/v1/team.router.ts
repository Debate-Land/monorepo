import { prisma, Team } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Team>(
  prisma.team as PrismaModel<Team>,
  // [auth, rateLimiter, usage]
);
