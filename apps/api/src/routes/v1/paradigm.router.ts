import { prisma, Paradigm } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Paradigm>(
  prisma.paradigm as PrismaModel<Paradigm>,
  // [auth, rateLimiter, usage]
);
