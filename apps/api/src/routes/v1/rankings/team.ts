import { prisma, TeamRanking } from "@shared/database";
import restHandler, { PrismaModel } from "../../../utils/rest-handler";
import status from 'http-status'
// import pscale from '../../services/pscale.service'

const router = restHandler<TeamRanking>(
  prisma.teamRanking as PrismaModel<TeamRanking>,
  // [auth, rateLimiter, usage]
);

type RankQueryResponse = [
  TeamRanking[],
  object[],
]

// router.get('/:circuit/:team/rank', async (req, res, next) => {
//   const { circuit, team } = req.params;
//   const result = await (await pscale).query(`
//     SELECT * FROM (
//       SELECT
//         RANK() OVER (ORDER BY otr DESC) AS circuitRank,
//         teamId,
//         otr
//       FROM
//         circuit_rankings
//       WHERE
//         circuitId = ?
//     ) t
//     WHERE teamId = ?;
//   `, [circuit, team]) as unknown as RankQueryResponse;

//   result[0].length
//     ? res.send(result[0][0])
//     : res.status(status.NOT_FOUND).send(result[0]);

// })

export default router;