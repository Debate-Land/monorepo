import { prisma, TopicTag } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<TopicTag>(
  prisma.topicTag as PrismaModel<TopicTag>,
  // [auth, rateLimiter, usage]
);
