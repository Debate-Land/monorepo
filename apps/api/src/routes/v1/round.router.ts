import { prisma, Round } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Round>(
  prisma.round as PrismaModel<Round>,
  // [auth, rateLimiter, usage]
);
