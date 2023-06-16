import { prisma, Alias } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Alias>(
  prisma.alias as PrismaModel<Alias>,
  // [auth, rateLimiter, usage]
);
