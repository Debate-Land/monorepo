import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Circuit, Event, JudgeRanking, RoundOutcome, Season, TeamRanking } from '@shared/database';
import { HeadToHeadRound } from '@src/components/tables/radar/HeadToHeadRoundTable';
import { PreviousHistoryRound } from '@src/components/tables/radar/PreviousHistoryTable';
import _ from 'lodash';

type EventDetails = {
  [key in Event]: (Circuit & {
    seasons: Season[];
  })[];
};

interface Result {
  name: string;
  id: string | number;
  type: "Team" | "Competitor" | "Judge" | "Tournament";
}

const featureRouter = router({
  compass: procedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const { prisma } = ctx;
      const events = (await prisma.circuit.groupBy({
        by: ["event"]
      })).map(e => e.event);

      let eventDetails: any = {};

      for (let i = 0; i < events.length; i++) {
        const eventCircuits = await prisma.circuit.findMany({
          where: {
            event: events[i]
          },
          include: {
            seasons: true
          }
        });

        eventDetails[events[i]] = eventCircuits;
      }

      return eventDetails as EventDetails;
    }),
  search: procedure
    .input(
      z.object({
        query: z.string().min(3).max(32),
        season: z.number().optional(),
        circuit: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const data = await Promise.all([
        prisma.alias.findMany({
          where: {
            code: {
              search: input.query
            },
            team: {
              ...(input.season && {
                seasons: {
                  some: {
                    id: input.season
                  }
                }
              }),
              ...(input.circuit && {
                circuits: {
                  some: {
                    id: input.circuit
                  }
                }
              }),
            }
          },
          select: {
            code: true,
            teamId: true,
          }
        }),
        prisma.competitor.findMany({
          where: {
            name: {
              search: input.query
            },
            teams: {
              some: {
                ...(input.season && {
                  seasons: {
                    some: {
                      id: input.season
                    }
                  }
                }),
                ...(input.circuit && {
                  circuits: {
                    some: {
                      id: input.circuit
                    }
                  }
                })
              }
            }
          },
          select: {
            name: true,
            id: true
          }
        }),
        prisma.judge.findMany({
          where: {
            name: {
              search: input.query
            },
            results: {
              some: {
                tournament: {
                  ...(input.season && {
                    seasonId: input.season
                  }),
                  ...(input.circuit && {
                    circuits: {
                      some: {
                        id: {
                          equals: input.circuit
                        }
                      }
                    }
                  })
                }
              }
            }
          },
          select: {
            name: true,
            id: true,
          }
        }),
        prisma.tournament.findMany({
          where: {
            name: {
              search: input.query
            },
            ...(input.season && {
              seasonId: input.season
            }),
            ...(input.circuit && {
              circuits: {
                some: {
                  id: {
                    equals: input.circuit
                  }
                }
              }
            })
          },
          select: {
            name: true,
            id: true,
          }
        })
      ]);

      let results: Result[] = [];

      data[0].forEach(team => results.push({
        name: team.code,
        id: team.teamId,
        type: 'Team'
      }));

      data[1].forEach(competitor => results.push({
        name: competitor.name,
        id: competitor.id,
        type: 'Competitor'
      }));

      data[2].forEach(judge => results.push({
        name: judge.name,
        id: judge.id,
        type: 'Judge'
      }));

      data[3].forEach(tournament => results.push({
        name: tournament.name,
        id: tournament.id,
        type: 'Tournament'
      }));

      return results;
    }),
  teamSearch: procedure
    .input(
      z.object({
        search: z.string(),
        event: z.string(),
        season: z.number(),
        circuit: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const results = await prisma.alias.findMany({
        where: {
          code: {
            search: input.search
          },
          team: {
            results: {
              some: {
                tournament: {
                  event: input.event as Event,
                  seasonId: input.season,
                  circuits: {
                    some: {
                      id: input.circuit
                    }
                  }
                }
              }
            }
          }
        },
        select: {
          code: true,
          id: true,
          teamId: true,
        },
        take: 10
      });

      return results;
    }),
    judgeSearch: procedure
    .input(
      z.object({
        search: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const results = await prisma.judge.findMany({
        where: {
          name: {
            search: input.search
          }
        },
        select: {
          name: true,
          id: true,
        },
        take: 10
      });

      return results;
    }),
  headToHead: procedure
    .input(
      z.object({
        event: z.string(),
        circuit: z.number(),
        season: z.number(),
        team1: z.string(),
        team2: z.string(),
        judges: z.array(z.string())
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const matchupHistoryPromise = prisma.round.findMany({
        where: {
          result: {
            teamId: input.team1
          },
          opponentId: input.team2
        },
        select: {
          result: {
            select: {
              tournament: {
                select: {
                  name: true,
                  start: true
                }
              }
            }
          },
          outcome: true,
          nameStd: true,
          ballotsWon: true,
          ballotsLost: true
        }
      });

      const getTeamRanking = (teamId: string) => (
        prisma.teamRanking.findUniqueOrThrow({
          where: {
            teamId_circuitId_seasonId: {
              teamId: teamId,
              circuitId: input.circuit,
              seasonId: input.season
            }
          },
          include: {
            team: {
              select: {
                aliases: {
                  select: {
                    code: true
                  },
                  take: 1
                }
              }
            }
          }
        })
      );

      const getJudgeRanking = async (judgeId: string) => {
        const preferredRanking = await prisma.judgeRanking.findUnique({
          where: {
            judgeId_circuitId_seasonId: {
              judgeId,
              circuitId: input.circuit,
              seasonId: input.season
            }
          },
          include: {
            judge: {
              select: {
                name: true,
                id: true
              }
            }
          }
        });

        if (preferredRanking) {
          return {
            index: preferredRanking.index,
            ...preferredRanking.judge
          };
        }

        const allRankings = await prisma.judgeRanking.findMany({
          where: {
            judgeId
          },
          include: {
            judge: {
              select: {
                name: true,
                id: true
              }
            }
          }
        });

        return {
          index: _.sum(allRankings.map(r => r.index)) / allRankings.length,
          ...allRankings[0].judge
        }

      }

      const team1Ranking = await getTeamRanking(input.team1);
      const team2Ranking = await getTeamRanking(input.team2);
      const judgeRankings = (await Promise.all(input.judges.map(id => getJudgeRanking(id))));

      const getRounds = (teamId: string) => (
        prisma.round.findMany({
          where: {
            result: {
              teamId
            },
            opponent: {
              isNot: null
            }
          },
          select: {
            opponent: {
              select: {
                rankings: true,
                aliases: {
                  select: {
                    code: true
                  },
                  take: 1
                }
              }
            },
            result: {
              select: {
                tournament: {
                  select: {
                    name: true,
                    circuits: {
                      select: {
                        id: true
                      }
                    },
                    seasonId: true,
                    start: true
                  },
                }
              }
            },
            outcome: true,
            ballotsWon: true,
            ballotsLost: true,
            nameStd: true
          },
        })
      );

      const filterRounds = async (
        teamId: string,
        rounds: PreviousHistoryRound[]
      ) => (
        Promise.all(rounds.map(async round => {
          const { otr: opponentOtr, circuitId, seasonId } = round.opponent!.rankings.find(r => (
            round.result.tournament.circuits.map(c => c.id).includes(r.circuitId)
            && round.result.tournament.seasonId === r.seasonId
          ))!;

          const { otr } = await prisma.teamRanking.findUniqueOrThrow({
            where: {
              teamId_circuitId_seasonId: {
                teamId,
                circuitId,
                seasonId
              }
            }
          });

          return {
            opponent: round.opponent!.aliases[0],
            name: round.result.tournament.name,
            outcome: round.outcome,
            opponentOtr,
            otr
          }
        }))
      );

      const team1History = await getRounds(input.team1);
      const team1Rounds = ((await filterRounds(input.team1, team1History))
        .map(round => {
          if (team1Ranking.otr >= team2Ranking.otr && (round.otr - round.opponentOtr) >= (team1Ranking.otr - team2Ranking.otr)) {
            return round;
          }
          else if (team1Ranking.otr <= team2Ranking.otr && (round.otr - round.opponentOtr) <= (team1Ranking.otr - team2Ranking.otr)) {
            return round;
          }
          else return null;
        })
        .filter(round => round !== null) as HeadToHeadRound[])
        .sort((a, b) => (a.otr - a.opponentOtr) - (b.otr - b.opponentOtr));

      const team2History = await getRounds(input.team2);
      const team2Rounds = ((await filterRounds(input.team2, team2History))
        .map(round => {
          if (team2Ranking.otr >= team1Ranking.otr && (round.otr - round.opponentOtr) >= (team2Ranking.otr - team1Ranking.otr)) {
            return round;
          }
          else if (team2Ranking.otr <= team1Ranking.otr && (round.otr - round.opponentOtr) <= (team2Ranking.otr - team1Ranking.otr)) {
            return round;
          }
          else return null;
        })
        .filter(round => round !== null) as HeadToHeadRound[])
        .sort((a, b) => (a.otr - a.opponentOtr) - (b.otr - b.opponentOtr));

      const matchupHistory = await matchupHistoryPromise;

      return {
        team1: {
          rounds: team1Rounds,
          history: team1History,
          ranking: team1Ranking
        },
        team2: {
          rounds: team2Rounds,
          history: team2History,
          ranking: team2Ranking
        },
        matchupHistory,
        judgeRankings
      };
    }),
  seasons: procedure
    .input(z.object({}))
    .query(({ ctx }) => {
      const { prisma } = ctx;
      return prisma.season.findMany({
        orderBy: {
          id: 'desc'
        }
      });
    })
});

export default featureRouter;
