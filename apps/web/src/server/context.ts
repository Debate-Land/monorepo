import { prisma } from "@shared/database";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

type CreateContextOptions = {
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({});
}