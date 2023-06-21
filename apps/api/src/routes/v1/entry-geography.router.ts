import { prisma, EntryGeography } from "@shared/database";
import restHandler, { PrismaModel } from "../../utils/rest-handler";

export default restHandler<EntryGeography>(
  prisma.entryGeography as PrismaModel<EntryGeography>,
  // [auth, rateLimiter, usage]
);
