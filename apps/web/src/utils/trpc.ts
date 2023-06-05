import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../server/routers/_app'

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc/',
          headers() {
            if (!ctx?.req?.headers) {
              return {};
            }

            const { connection: _connection, ...headers } = ctx.req.headers;
            return headers;
          },
        }),
      ],
    };
  },
});
