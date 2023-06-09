import { prisma, TeamRanking } from "@shared/database";
import restHandler, { PrismaModel } from "../../../utils/rest-handler";
import status from 'http-status'
import db from '../../../services/db.service';

const router = restHandler<TeamRanking>(
  prisma.teamRanking as PrismaModel<TeamRanking>,
  // [auth, rateLimiter, usage]
);

type RankQueryResponse = [
  TeamRanking[],
  object[],
]

router.get('/:circuit/:season/:team/rank', async (req, res, next) => {
  const { circuit, season, team } = req.params;
  const result = await (await db).query(`
    SELECT * FROM (
      SELECT
        RANK() OVER (ORDER BY otr DESC) AS circuitRank,
        team_id,
        otr
      FROM
        team_rankings
      WHERE
        circuit_id = ? AND
        season_id = ?
    ) t
    WHERE team_id = ?;
  `, [circuit, season, team]) as unknown as RankQueryResponse;

  result[0].length
    ? res.send(result[0][0])
    : res.status(status.NOT_FOUND).send(result[0]);

})

export default router;