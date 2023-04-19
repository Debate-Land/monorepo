import { z } from 'zod';
import { procedure, router } from '../trpc';
import { prisma } from '@shared/database';
import { getAvg } from '@src/utils/get-statistics';
import { sortBy } from 'lodash';

const datasetRouter = router({
  summary: procedure
    .input(
      z.object({
        circuit: z.number(),
        season: z.number(),
      })
    )
    .query(async ({ input }) => {
      const data = await Promise.all([
        // Circuit Name
        prisma.circuit.findUnique({
          where: {
            id: input.circuit
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
        })
      ]);

      return {
        circuit: data[0],
        numTeams: data[1],
        numTournaments: data[2],
        numCompetitors: data[3],
        numSchools: data[4],
        numBids: data[5],
        numJudges: data[6],
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
    .query(async ({ input }) => {
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
    .query(async ({ input }) => {
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
        }
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
    .query(async ({ input }) => {
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
      const result = await prisma.judgeRanking.findMany({
        where: {
          circuit: {
            id: {
              equals: input.circuit
            }
          },
          season: {
            id: {
              equals: input.season
            }
          }
        },
        include: {
          judge: {
            include: {
              records: {
                where: {
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
                },
                select: {
                  id: true,
                  avgSpeakerPoints: true
                }
              },
            }
          },
        },
        orderBy: [
          {
            index: "desc"
          },
          {
            judge: {
              records: {
                _count: "desc"
              }
            }
          }
        ],
        skip: input.page * input.limit,
        take: input.limit
      })

      return result;
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
    .query(async ({ input }) => {
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
      })
    )
    .query(async ({ input }) => {
      let groups = await prisma.bid.groupBy({
        by: ['teamId', 'value'],
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
        },
        _count: {
          value: true
        },
      });

      let lookup: {
        [key: string]: {
          fullBids: number;
          partialBids: number;
        }
      } = {};

      groups.forEach(group => {
        let id = group['teamId'];
        if (!lookup[id]) lookup[id] = {
          fullBids: 0,
          partialBids: 0,
        };
        if (group['value'] === 'Full') lookup[id]['fullBids'] += group._count.value;
        else lookup[id]['partialBids'] += group._count.value;
      });

      let results: {
        code: string;
        teamId: string;
        fullBids: number;
        partialBids: number;
      }[] = [];

      for (const [teamId, data] of Object.entries(lookup)) {
        const code = (await prisma.alias.findFirst({
          where: {
            teamId
          },
          select: {
            code: true
          }
        }))!['code'];

        results.push({
          code,
          teamId,
          ...data
        });
      };

      return sortBy(results, ['fullBids', 'partialBids']).reverse();
    })
});

export default datasetRouter;
