import { prisma, Circuit } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Circuit>(
  prisma.circuit as PrismaModel<Circuit>,
  // [auth, rateLimiter, usage]
);
