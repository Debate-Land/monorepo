import { prisma, JudgeRecord } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<JudgeRecord>(
  prisma.judgeRecord as PrismaModel<JudgeRecord>,
  // [auth, rateLimiter, usage]
);
