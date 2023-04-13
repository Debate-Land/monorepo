import { prisma, Season } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Season>(
  prisma.season as PrismaModel<Season>,
  // [auth, rateLimiter, usage]
);
