import { initTRPC } from '@trpc/server';
import { createTRPCContext } from './context';

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const procedure = t.procedure;