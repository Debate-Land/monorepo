import { z } from 'zod';
import { procedure, router } from '../trpc';
import sortRounds from '@src/utils/sort-rounds';
import getStatistics from '@src/utils/get-statistics';
import db from '@src/services/db.service';
import { TeamRanking } from '@shared/database';

const teamRouter = router({
  summary: procedure
    .input(
      z.object({
        id: z.string(),
        season: z.number().optional(),
        circuit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      let {rankings, ...team} = await prisma.team.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          competitors: true,
          results: {
            include: {
              tournament: {
                include: {
                  circuits: true,
                  topic: {
                    include: {
                      tags: true
                    }
                  },
                }
              },
              bid: {
                select: {
                  value: true,
                  isGhostBid: true
                }
              },
              alias: true,
              school: true,
              speaking: {
                include: {
                  competitor: {
                    select: {
                      name: true
                    }
                  }
                }
              },
            },
            where: {
              tournament: {
                ...(input.circuit && {
                  circuits: {
                    some: {
                      id: {
                        equals: input.circuit
                      }
                    }
                  }
                }),
                ...(input.season && {
                  seasonId: {
                    equals: input.season
                  }
                }),
              },
            },
          },
          aliases: {
            select: {
              code: true,
            }
          },
          schools: true,
          rankings: {
            include: {
              season: true,
              circuit: true,
            },
            where: {
              ...(input.circuit && {
                circuit: {
                  id: {
                    equals: input.circuit
                  }
                }
              }),
              ...(input.season && {
                seasonId: {
                  equals: input.season
                }
              }),
            }
          },
          circuits: {
            select: {
              name: true,
              event: true,
              id: true,
            }
          },
          seasons: true,
          _count: {
            select: {
              rounds: true
            }
          }
        }
      });
      if (team) {
        const circuitRankQuery = await (await db).query(`
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
        `, [input.circuit, input.season, team.id]) as unknown as [
          (TeamRanking & { circuitRank: number })[],
          object[],
        ];
        return {
          ...team,
          ranking: {
            ...rankings[0],
            circuitRank: circuitRankQuery[0][0].circuitRank
          },
          statistics: getStatistics({ rankings, ...team }
          )
        }
      }
      return null;
    }),
  rounds: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const rounds = await prisma.round.findMany({
        where: {
          resultId: input.id
        },
        include: {
          opponent: {
            select: {
              aliases: {
                take: 1
              },
              id: true,
            }
          },
          records: {
            select: {
              decision: true,
              judge: true,
            }
          },
          speaking: {
            include: {
              competitor: true,
            }
          }
        }
      });

      if (rounds) {
        return sortRounds<typeof rounds[0]>(rounds);
      }

      return rounds;
    }),
});

export default teamRouter;
