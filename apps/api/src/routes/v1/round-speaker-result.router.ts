import { prisma, RoundSpeakerResult } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<RoundSpeakerResult>(
  prisma.roundSpeakerResult as PrismaModel<RoundSpeakerResult>,
  // [auth, rateLimiter, usage]
);
