import { prisma, Bid } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Bid>(
  prisma.bid as PrismaModel<Bid>,
  // [auth, rateLimiter, usage]
);
