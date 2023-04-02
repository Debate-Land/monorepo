import { z } from 'zod';
import { procedure, router } from '../trpc';
import { Event, prisma } from '@shared/database';
import sortRounds from '@src/utils/sort-rounds';
import getStatistics, { getAvg } from '@src/utils/get-statistics';

export const appRouter = router({
  team: procedure
    .input(
      z.object({
        id: z.string(),
        seasons: z.array(z.number()).optional(),
        circuits: z.array(z.number()).optional(),
        event: z.string().refine((data) => Object.values(Event).includes(data as Event)),
      })
    )
    .query(async ({ input }) => {
      let team = await prisma.team.findUnique({
        where: {
          id: input.id,
        },
        include: {
          competitors: true,
          results: {
            include: {
              tournament: {
                include: {
                  circuits: true
                }
              },
              alias: true,
              school: true,
              speaking: true,
            },
            where: {
              tournament: {
                event: {
                  equals: input.event as Event
                },
                ...(input.circuits && {
                  circuits: {
                    some: {
                      id: {
                        in: input.circuits
                      }
                    }
                  }
                }),
                ...(input.seasons && {
                  seasonId: {
                    in: input.seasons
                  }
                }),
              },
            },
          },
          aliases: {
            take: 1,
            select: {
              code: true,
            }
          },
          rankings: {
            include: {
              season: true,
              circuit: true,
            },
            where: {
              ...(input.circuits && {
                circuit: {
                  id: {
                    in: input.circuits
                  },
                  event: {
                    in: input.event as Event
                  }
                }
              }),
              ...(input.seasons && {
                seasonId: {
                  in: input.seasons
                }
              }),
            }
          },
          circuits: true,
          seasons: true,
          _count: {
            select: {
              rounds: true
            }
          }
        }
      });
      if (team) {
        return { ...team, statistics: getStatistics(team) }
      }
      return null;
    }),
  rounds: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(async ({ input }) => {
      const rounds = await prisma.round.findMany({
        where: {
          tournamentResultId: input.id
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
          judgeRecords: {
            select: {
              decision: true,
              tabJudgeId: true,
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
  dataset: procedure
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
        // Leaderboard
        prisma.circuitRanking.findMany({
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
              },
            },
            otr: true,
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
        // Tournaments
        prisma.tournament.findMany({
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
            results: {
              select: {
                school: true
              }
            },
            _count: {
              select: {
                results: true,
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
        // Competitors
        prisma.competitor.findMany({
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
        // Schools
        prisma.school.findMany({
          where: {
            tournamentResults: {
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
        // # Schools
        prisma.school.count({
          where: {
            tournamentResults: {
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
        // Bids
        prisma.tournamentResult.groupBy({
          by: ['teamId'],
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
          having: {
            bid: {
              _sum: {
                gte: 1
              }
            }
          }
        }),
        // # Bids
        prisma.tournamentResult.aggregate({
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
          _sum: {
            bid: true,
          }
        }),
        // Judges
        prisma.judge.findMany({
          where: {
            records: {
              some: {
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
          },
        }),
        // # Judges
        prisma.judge.count({
          where: {
            records: {
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
        leaderboard: data[1],
        numTeams: data[2],
        tournaments: data[3],
        numTournaments: data[4],
        competitors: data[5],
        numCompetitors: data[6],
        schools: data[7],
        numSchools: data[8],
        bids: data[9],
        numBids: data[10]?._sum.bid,
        judges: data[11],
        numJudges: data[12],
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
      const teams = await prisma.circuitRanking.findMany({
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
                  elimBallotsWon: true,
                  elimBallotsLost: true,
                  opWpm: true,
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
            eRecord[0] += r.elimBallotsWon || 0;
            eRecord[1] += r.elimBallotsLost || 0;
            opWpm.push(r.opWpm);
            speaks.push(...r.speaking.map(d => d.rawAvgPoints));
          });

          let pWp = pRecord[0] / (pRecord[0] + pRecord[1]);
          let tWp = (pRecord[0] + eRecord[0]) / (pRecord[0] + pRecord[1] + eRecord[0] + eRecord[1]) + eRecord[0] / (eRecord[0] + eRecord[1]) * 0.1;
          if (tWp > 1) tWp = 1;

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
              results: true,
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
      const result = await prisma.judge.findMany({
        where: {
          records: {
            some: {
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
        },
        orderBy: {
          records: {
            _count: "desc"
          }
        },
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
            }
          }
        },
        skip: input.page * input.limit,
        take: input.limit
      });

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
          tournamentResults: {
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
          tournamentResults: {
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
            }
          }
        },
        orderBy: {
          tournamentResults: {
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
      const result = await prisma.tournamentResult.groupBy({
        by: ['teamId'],
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
          },
          bid: {
            not: 0,
          }
        },
        having: {
          bid: {
            _min: {
              equals: 1
            },
            _sum: {
              gte: 1
            }
          }
        },
        _sum: {
          bid: true
        }
      });

      // @ts-ignore
      let hydratedResults: {
        code: string
      } & typeof result = [];

      if (result) {
        result.forEach(async (r) => {
          const lookup = await prisma.team.findUnique({
            where: {
              id: r.teamId
            },
            select: {
              aliases: {
                select: {
                  code: true
                },
                take: 1
              }
            }
          });
          if (lookup && lookup.aliases[0]?.code) {
            hydratedResults.push({
              // @ts-ignore
              code: lookup.aliases[0].code as string,
              ...r
            });
          }
        })
      }

      return hydratedResults;
    })
});

// export type definition of API
export type AppRouter = typeof appRouter;