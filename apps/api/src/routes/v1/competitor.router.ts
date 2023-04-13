import { prisma, Competitor } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Competitor>(
  prisma.competitor as PrismaModel<Competitor>,
  // [auth, rateLimiter, usage]
);
