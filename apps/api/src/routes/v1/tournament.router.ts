import { prisma, Tournament } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Tournament>(
  prisma.tournament as PrismaModel<Tournament>,
  // [auth, rateLimiter, usage]
);
