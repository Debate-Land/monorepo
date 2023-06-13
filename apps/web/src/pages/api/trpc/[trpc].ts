import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/_app';
import { createTRPCContext } from '@src/server/context';

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  responseMeta({ ctx, paths, errors, type }) {
    const allOk = errors.length == 0;
    const isQuery = type == 'query';

    if (allOk && isQuery) {
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      return {
        headers: {
          'Cache-Control': `max-age=0, s-maxage=${ONE_DAY_IN_SECONDS}`,
        }
      };
    }
    return {};
  }
});