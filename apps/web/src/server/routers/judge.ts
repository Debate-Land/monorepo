import { z } from 'zod';
import { procedure, router } from '../trpc';
import sortRecords from '@src/utils/sort-records';
import { Topic, TopicTag } from '@shared/database';

const judgeRouter = router({
  summary: procedure
    .input(
      z.object({
        id: z.string(),
        season: z.number().optional(),
        circuit: z.number().optional(),
        topics: z.array(z.number()).optional(),
        topicTags: z.array(z.number()).optional()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const [judge, ranking, filterData] = await Promise.all([
        prisma.judge.findUnique({
          where: {
            id: input.id
          },
          include: {
            results: {
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
                  ...(input.topics && {
                    topic: {
                      id: {
                        in: input.topics
                      }
                    }
                  }),
                  ...(input.topicTags && {
                    topic: {
                      tags: {
                        some: {
                          id: {
                            in: input.topicTags
                          }
                        }
                      }
                    }
                  })
                }
              },
              include: {
                tournament: {
                  select: {
                    name: true,
                    start: true,
                    topic: {
                      include: {
                        tags: true
                      }
                    }
                  }
                }
              },
              orderBy: {
                tournament: {
                  start: "asc"
                }
              }
            },
            rankings: {
              include: {
                season: true,
                circuit: {
                  select: {
                    id: true,
                    name: true,
                    event: true
                  }
                },
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
            paradigms: true,
            _count: {
              select: {
                records: true
              }
            }
          }
        }),
        input.circuit && input.season
          ? prisma.judgeRanking.findUnique({
            where: {
              judgeId_circuitId_seasonId: {
                judgeId: input.id,
                circuitId: input.circuit,
                seasonId: input.season
              }
            },
            select: {
              index: true
            }
          })
          : null,
        prisma.judgeTournamentResult.findMany({
          where: {
            judgeId: {
              equals: input.id
            },
            tournament: {
              ...(input.season && {
                seasonId: {
                  equals: input.season
                }
              }),
              ...(input.circuit && {
                circuits: {
                  some: {
                    id: {
                      equals: input.circuit
                    }
                  }
                }
              }),
            }
          },
          select: {
            tournament: {
              select: {
                topic: {
                  include: {
                    tags: true,
                  }
                }
              }
            }
          }
        })
          .then(d => d
          .map(({ tournament }) => tournament!.topic)
          .filter(t => t !== null) as (Topic & { tags: TopicTag[] })[]
        )
      ]);

      return judge
        ? {
          ...judge,
          filterData,
          ...(ranking && { index: ranking.index })
        }
        : undefined
    }),
  records: procedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const records = await prisma.judgeRecord.findMany({
        where: {
          resultId: input.id
        },
        select: {
          rounds: {
            include: {
              speaking: {
                include: {
                  competitor: true
                }
              },
              result: {
                select: {
                  team: {
                    include: {
                      aliases: {
                        select: {
                          code: true
                        },
                        take: 1
                      },
                    }
                  }
                }
              },
              records: {
                select: {
                  judge: {
                    select: {
                      name: true,
                      id: true
                    }
                  },
                  decision: true,
                  winner: {
                    select: {
                      aliases: {
                        take: 1,
                        select: {
                          code: true,
                        }
                      },
                      id: true,
                    }
                  }
                }
              }
            }
          },
          decision: true,
          avgSpeakerPoints: true
        },
      });

      return sortRecords<typeof records[0]>(records);
    })
});

export default judgeRouter;
