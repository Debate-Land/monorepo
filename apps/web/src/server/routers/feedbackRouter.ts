import { z } from 'zod';
import { procedure, router } from '../trpc';
import { LinearClient } from '@linear/sdk';
import { LINEAR_USER_SUBMISSION_LABEL_ID } from '@src/const/linear-label-options';

const feedbackRouter = router({
  create: procedure
    .input(z.object({
      email: z.string(),
      title: z.string(),
      description: z.string(),
      category: z.string(),
    }))
    .mutation(async ({ input }) => {
      const client = new LinearClient({
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        apiKey: process.env.NEXT_PUBLIC_LINEAR_KEY
      });

      const teams = await client.teams();
      const team = teams.nodes[0];
      // const labels = await team.labels();

      const issue = await client.createIssue({
        teamId: team.id,
        title: input.title,
        description: `${input.description} (Submitted by ${input.email})`,
        labelIds: [
          LINEAR_USER_SUBMISSION_LABEL_ID,
          input.category
        ]
      });

      return issue;
    })
});

export default feedbackRouter;
