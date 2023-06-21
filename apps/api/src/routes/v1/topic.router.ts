import { prisma, Topic } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<Topic>(
  prisma.topic as PrismaModel<Topic>,
  // [auth, rateLimiter, usage]
);
