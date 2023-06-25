import { z } from 'zod';
import { procedure, router } from '../trpc';
import { getAvg } from '@src/utils/get-statistics';
import { sortBy } from 'lodash';
import db from '@src/services/db.service';
import { BidTableRow } from '@src/components/tables/dataset/BidTable';

const datasetRouter = router({
  summary: procedure
    .input(
      z.object({
        circuit: z.number(),
        season: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const data = await Promise.all([
        // Circuit Name
        prisma.circuit.findUnique({
          where: {
            id: input.circuit
          },
          select: {
            event: true,
            name: true,
          }
        }),
        // # Teams
        prisma.team.count({
          where: {
            results: {
              some: {
                tournament: {
                  circuits: {
                    some: {
                      id: {
                        equals: input.circuit
                      }
                    }
                  },
                  seasonId: {
                    equals: input.season
                  }
                }
              }
            }
          }
        }),
        // # Tournaments
        prisma.tournament.count({
          where: {
            circuits: {
              some: {
                id: {
                  equals: input.circuit
                }
              }
            },
            seasonId: {
              equals: input.season
            }
          },
          orderBy: {
            start: "asc"
          }
        }),
        // # Competitors
        prisma.competitor.count({
          where: {
            teams: {
              some: {
                results: {
                  some: {
                    tournament: {
                      circuits: {
                        some: {
                          id: {
                            equals: input.circuit
                          }
                        }
                      },
                      seasonId: {
                        equals: input.season
                      }
                    }
                  }
                }
              }
            }
          }
        }),
        // # Schools
        prisma.school.count({
          where: {
            results: {
              some: {
                tournament: {
                  circuits: {
                    some: {
                      id: {
                        equals: input.circuit
                      }
                    }
                  },
                  seasonId: {
                    equals: input.season
                  }
                }
              }
            }
          }
        }),
        // # Bids
        prisma.bid.count({
          where: {
            result: {
              tournament: {
                circuits: {
                  some: {
                    id: {
                      equals: input.circuit
                    }
                  }
                },
                season: {
                  id: {
                    equals: input.season
                  }
                }
              }
            }
          }
        }),
        // # Gold Qualifiers
        (await db).query(`
          SELECT COUNT(*) AS numGoldQualifiers
          FROM (
            SELECT
              fullBids.team_id,
              fullBids.num AS full_num,
              partialBids.num AS partial_num,
              a.code AS code
            FROM (
              SELECT
                b.team_id,
                COUNT(*) AS num
              FROM bids b
              INNER JOIN team_tournament_results ttr ON b.result_id = ttr.id
              INNER JOIN tournaments t ON t.id = ttr.tournament_id
              INNER JOIN _CircuitToTournament ctt ON t.id = ctt.B
              WHERE
                ctt.A = 40 AND
                t.season_id = 2023 AND
                b.value = 'Full'
              GROUP BY b.team_id
            ) fullBids
            INNER JOIN (
              SELECT
                b.team_id,
                COUNT(*) AS num
              FROM bids b
              INNER JOIN team_tournament_results ttr ON b.result_id = ttr.id
              INNER JOIN tournaments t ON t.id = ttr.tournament_id
              INNER JOIN _CircuitToTournament ctt ON t.id = ctt.B
              WHERE
                ctt.A = 40 AND
                t.season_id = 2023 AND
                b.value = 'Partial'
              GROUP BY b.team_id
            ) partialBids ON fullBids.team_id = partialBids.team_id
            INNER JOIN (
              SELECT team_id, MIN(code) AS code
              FROM aliases
              GROUP BY team_id
            ) a ON fullBids.team_id = a.team_id
            WHERE fullBids.num >= 2
            GROUP BY fullBids.team_id, partialBids.num, fullBids.num, a.code
          ) AS subquery;
        `) as unknown as [
          {
            numGoldQualifiers: number
          }[],
          object[]
        ],
        (await db).query(`
          SELECT COUNT(*) AS numSilverQualifiers
          FROM (
            SELECT
              fullBids.team_id,
              fullBids.num AS full_num,
              partialBids.num AS partial_num,
              a.code AS code
            FROM (
              SELECT
                b.team_id,
                COUNT(*) AS num
              FROM bids b
              INNER JOIN team_tournament_results ttr ON b.result_id = ttr.id
              INNER JOIN tournaments t ON t.id = ttr.tournament_id
              INNER JOIN _CircuitToTournament ctt ON t.id = ctt.B
              WHERE
                ctt.A = 40 AND
                t.season_id = 2023 AND
                b.value = 'Full'
              GROUP BY b.team_id
            ) fullBids
            INNER JOIN (
              SELECT
                b.team_id,
                COUNT(*) AS num
              FROM bids b
              INNER JOIN team_tournament_results ttr ON b.result_id = ttr.id
              INNER JOIN tournaments t ON t.id = ttr.tournament_id
              INNER JOIN _CircuitToTournament ctt ON t.id = ctt.B
              WHERE
                ctt.A = 40 AND
                t.season_id = 2023 AND
                b.value = 'Partial'
              GROUP BY b.team_id
            ) partialBids ON fullBids.team_id = partialBids.team_id
            INNER JOIN (
              SELECT team_id, MIN(code) AS code
              FROM aliases
              GROUP BY team_id
            ) a ON fullBids.team_id = a.team_id
            WHERE fullBids.num < 2 AND partialBids.num > 0
            GROUP BY fullBids.team_id, partialBids.num, fullBids.num, a.code
          ) AS subquery;
        `) as unknown as [
          {
            numSilverQualifiers: number
          }[],
          object[]
        ],
        // # Judges
        prisma.judge.count({
          where: {
            results: {
              some: {
                tournament: {
                  circuits: {
                    some: {
                      id: {
                        equals: input.circuit
                      }
                    }
                  },
                  seasonId: {
                    equals: input.season
                  }
                }
              }
            }
          }
        }),
      ]);

      return {
        circuit: data[0],
        numTeams: data[1],
        numTournaments: data[2],
        numCompetitors: data[3],
        numSchools: data[4],
        numBids: data[5],
        numGoldQualifiers: data[6][0][0].numGoldQualifiers,
        numSilverQualifiers: data[7][0][0].numSilverQualifiers,
        numJudges: data[8],
      };
    }),
  leaderboard: procedure
    .input(
      z.object({
        circuit: z.number(),
        season: z.number(),
        page: z.number(),
        limit: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const teams = await prisma.teamRanking.findMany({
        where: {
          seasonId: input.season,
          circuitId: input.circuit,
        },
        orderBy: {
          otr: "desc"
        },
        select: {
          team: {
            select: {
              aliases: {
                take: 1
              },
              id: true,
              results: {
                select: {
                  prelimBallotsWon: true,
                  prelimBallotsLost: true,
                  elimWins: true,
                  elimLosses: true,
                  opWpM: true,
                  speaking: {
                    select: {
                      rawAvgPoints: true
                    }
                  },
                }
              }
            },
          },
          otr: true,
        },
        skip: input.page * input.limit,
        take: input.limit
      });

      if (teams) {
        let teamsWithStatistics: (typeof teams[0] & {
          statistics: {
            pWp: number;
            tWp: number;
            avgRawSpeaks: number;
            avgOpWpM: number;
          }
        })[] = [];
        teams.forEach(t => {
          let pRecord = [0, 0];
          let eRecord = [0, 0];
          let opWpm: number[] = [];
          let speaks: number[] = [];

          t.team.results.forEach(r => {
            pRecord[0] += r.prelimBallotsWon;
            pRecord[1] += r.prelimBallotsLost;
            eRecord[0] += r.elimWins || 0;
            eRecord[1] += r.elimLosses || 0;
            opWpm.push(r.opWpM);
            speaks.push(...r.speaking.map(d => d.rawAvgPoints));
          });

          let pWp = pRecord[0] / (pRecord[0] + pRecord[1]);
          let tWp = (pRecord[0] + (eRecord[0])) / (pRecord[0] + pRecord[1] + eRecord[0] + eRecord[1]) + eRecord[0] / (eRecord[0] + eRecord[1]) * 0.1;
          if (tWp > 1) tWp = 1;
          else if (eRecord[0] == 0 && eRecord[1] == 0) tWp = pRecord[0] / (pRecord[0] + pRecord[1]);

          teamsWithStatistics.push({
            statistics: {
              pWp,
              tWp,
              avgRawSpeaks: getAvg(speaks),
              avgOpWpM: getAvg(opWpm)
            },
            ...t
          })
        });
        return teamsWithStatistics;
      }

      return teams;
    }),
  tournaments: procedure
    .input(
      z.object({
        circuit: z.number(),
        season: z.number(),
        page: z.number(),
        limit: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const result = await prisma.tournament.findMany({
        where: {
          circuits: {
            some: {
              id: {
                equals: input.circuit
              }
            }
          },
          seasonId: {
            equals: input.season
          }
        },
        include: {
          _count: {
            select: {
              teamResults: true,
            }
          }
        },
        orderBy: {
          start: "asc"
        },
        skip: input.page * input.limit,
        take: input.limit
      });

      return result;
    }),
  competitors: procedure
    .input(
      z.object({
        circuit: z.number(),
        season: z.number(),
        page: z.number(),
        limit: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const result = await prisma.competitor.findMany({
        where: {
          teams: {
            some: {
              results: {
                some: {
                  tournament: {
                    circuits: {
                      some: {
                        id: {
                          equals: input.circuit
                        }
                      }
                    },
                    seasonId: {
                      equals: input.season
                    }
                  }
                }
              }
            }
          }
        },
        include: {
          teams: {
            where: {
              results: {
                some: {
                  tournament: {
                    circuits: {
                      some: {
                        id: {
                          equals: input.circuit
                        }
                      }
                    },
                    seasonId: {
                      equals: input.season
                    }
                  }
                }
              }
            },
            select: {
              id: true
            },
          }
        },
        orderBy: {
          teams: {
            _count: "desc"
          }
        },
        skip: input.page * input.limit,
        take: input.limit
      });

      return result;
    }),
  judges: procedure
    .input(
      z.object({
        circuit: z.number(),
        season: z.number(),
        page: z.number(),
        limit: z.number()
      })
    )
    .query(async ({ input }) => {
      const result = await (await db).query(`
        SELECT
          RANK() OVER (ORDER BY \`index\` DESC, t.numRounds DESC) AS circuitRank,
          *
        FROM (
          SELECT DISTINCT
            judge_rankings.judge_id,
            judges.name,
            judge_rankings.\`index\`,
            t.numRounds,
            t.avgSpeakerPoints
          FROM judge_rankings
          INNER JOIN judges ON judge_rankings.judge_id = judges.id
          INNER JOIN (
            SELECT
              judgeId,
              COUNT(*) / 2 as numRounds,
              AVG(jr.avgSpeakerPoints) as avgSpeakerPoints
            FROM _JudgeRecordToRound jrtr
            INNER JOIN judge_records jr ON jrtr.A = jr.id
            INNER JOIN tournaments t ON jr.tournamentId = t.id
            WHERE
              t.id IN (
                SELECT ctt.B
                FROM _CircuitToTournament ctt
                WHERE ctt.A = ?
              ) AND
              t.season_id = ?
            GROUP BY judgeId
          ) as t ON judge_rankings.judge_id = t.judgeId
          WHERE
            judge_rankings.circuit_id = ? AND
            judge_rankings.season_id = ?
        ) t
        ORDER BY circuitRank
        LIMIT ?
        OFFSET ?;
      `,
      [input.circuit, input.season, input.circuit, input.season, input.limit, input.page ? input.page * input.limit : 0]) as unknown as [
        {
          circuitRank: number;
          judge_id: string;
          name: string;
          index: number;
          numRounds: number;
          avgSpeakerPoints: number | null;
        }[],
        object[]
      ];

      return result[0];
    }),
  schools: procedure
    .input(
      z.object({
        circuit: z.number(),
        season: z.number(),
        page: z.number(),
        limit: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const result = await prisma.school.findMany({
        where: {
          results: {
            some: {
              tournament: {
                circuits: {
                  some: {
                    id: {
                      equals: input.circuit
                    }
                  }
                },
                seasonId: {
                  equals: input.season
                }
              }
            }
          }
        },
        include: {
          results: {
            where: {
              tournament: {
                circuits: {
                  some: {
                    id: {
                      equals: input.circuit
                    }
                  }
                },
                seasonId: {
                  equals: input.season
                }
              }
            },
            select: {
              id: true,
            },
          },
          teams: {
            where: {
              results: {
                some: {
                  tournament: {
                    circuits: {
                      some: {
                        id: {
                          equals: input.circuit
                        }
                      }
                    },
                    seasonId: {
                      equals: input.season
                    }
                  }
                }
              }
            },
            select: {
              id: true
            }
          },
          tournaments: {
            where: {
              circuits: {
                some: {
                  id: {
                    equals: input.circuit
                  }
                }
              },
              seasonId: {
                equals: input.season
              }
            },
            select: {
              id: true,
            }
          }
        },
        orderBy: {
          results: {
            _count: "desc"
          }
        },
        skip: input.page * input.limit,
        take: input.limit,
      });

      return result;
    }),
  bids: procedure
    .input(
      z.object({
        circuit: z.number(),
        season: z.number(),
        page: z.number(),
        limit: z.number()
      })
    )
    .query(async ({ input }) => {
      const result = await (await db).query(`
        SELECT
          fullBids.team_id as teamId,
          fullBids.num AS numFull,
          partialBids.num AS numPartial,
          a.code AS code,
          RANK() OVER (ORDER BY fullBids.num DESC, partialBids.num DESC) as bidRank
        FROM (
          SELECT
            b.team_id,
            COUNT(*) AS num
          FROM bids b
          INNER JOIN team_tournament_results ttr ON b.result_id = ttr.id
          INNER JOIN tournaments t ON t.id = ttr.tournament_id
          INNER JOIN _CircuitToTournament ctt ON t.id = ctt.B
          WHERE
            ctt.A = ? AND
            t.season_id = ? AND
            b.value = 'Full'
          GROUP BY b.team_id
        ) fullBids
        INNER JOIN (
          SELECT
            b.team_id,
            COUNT(*) AS num
          FROM bids b
          INNER JOIN team_tournament_results ttr ON b.result_id = ttr.id
          INNER JOIN tournaments t ON t.id = ttr.tournament_id
          INNER JOIN _CircuitToTournament ctt ON t.id = ctt.B
          WHERE
            ctt.A = ? AND
            t.season_id = ? AND
            b.value = 'Partial'
          GROUP BY b.team_id
        ) partialBids ON fullBids.team_id = partialBids.team_id
        INNER JOIN (
          SELECT team_id, MIN(code) AS code
          FROM aliases
          GROUP BY team_id
        ) a ON fullBids.team_id = a.team_id
        GROUP BY fullBids.team_id, partialBids.num, fullBids.num, a.code
        ORDER BY numFull DESC, numPartial DESC
        LIMIT ?
        OFFSET ?;
      `,
      [input.circuit, input.season, input.circuit, input.season, input.limit, input.page ? input.page * input.limit : 0]) as unknown as [
        BidTableRow[],
        object[]
      ];

      return result[0];
    })
});

export default datasetRouter;
