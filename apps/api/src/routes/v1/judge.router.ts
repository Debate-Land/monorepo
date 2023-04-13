import { prisma, Judge } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Judge>(
  prisma.judge as PrismaModel<Judge>,
  // [auth, rateLimiter, usage]
);
