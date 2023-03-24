export const getTeamQuery = (id: string) => {
  return {
    where: {
      id,
    },
    include: {
      competitors: true,
      results: {
        include: {
          speaking: {
            include: {
              competitor: {
                select: {
                  name: true,
                },
              },
            },
          },
          alias: true,
          rounds: {
            include: {
              judgeRecords: {
                include: {
                  judge: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              opponent: {
                select: {
                  id: true,
                  aliases: {
                    take: 1,
                    select: {
                      code: true,
                    },
                  },
                },
              },
              speaking: {
                include: {
                  competitor: {
                    select: {
                      name: true,
                    },
                  },
                  judge: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      rankings: true,
    },
  }
}
