import { z } from 'zod';
import { procedure, router } from '../trpc';
import * as cheerio from 'cheerio';
import db from '@src/services/db.service';
import { JudgeRanking, TeamRanking } from '@shared/database';

export interface TournamentSearchResult {
  id: number;
  date: string;
  name: string;
};

export interface ScrapingOption {
  id: number;
  name: string;
}

const scrapingRouter = router({
  tournament: procedure
    .input(z.object({
      search: z.string()
    }))
    .mutation(async ({ input }) => {
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/search.mhtml?search=${input.search}`)
        .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);
      const results: TournamentSearchResult[] = [];
      $('tr').each((idx, row) => {
        if (idx === 0) return;
        const result: any = {}
        $(row)
          .find('td')
          .each((i, cell) => {
            if (i === 0) {
              result.id = parseInt($(cell)
                .find('a')
                .attr()!['href']
                .replace('/index/tourn/index.mhtml?tourn_id=', ''));
              result.name = $(cell).text().trim();
            } else if (i === 2) {
              result.date = new Date($(cell).text());
            }
          });
        results.push(result as TournamentSearchResult);
      });
      return results;
    }),
  entries: procedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input }) => {
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/tourn/fields.mhtml?tourn_id=${input.id}`)
        .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);
      const events: ScrapingOption[] = [];
      $('#content > div.menu > div.sidenote > a').each((idx, event) => {
        events.push({
          id: parseInt($(event)
            .attr()!['href']
            .replace(`/index/tourn/fields.mhtml?tourn_id=${input.id}&event_id=`, '')),
          name: $(event).text().trim()
        });
      });
      return events;
    }),
  judges: procedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input }) => {
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/tourn/judges.mhtml?tourn_id=${input.id}`)
        .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);
      const pools: ScrapingOption[] = [];
      $('#content > div.menu > div.sidenote > div').each((idx, pool) => {
        let id: number = 0;
        let name: string = '';
        $(pool).find('a').each((idx, a) => {
          if (idx === 0) {
            id = parseInt(
              $(a)
                .attr()!['href']
                .replace('/index/tourn/judges.mhtml?category_id=', '')
                .replace(`&tourn_id=${input.id}`, '')
            )
          }
        });
        $(pool).find('span').each((idx, span) => {
          if (idx === 0) {
            name = $(span).text().trim()
          }
        });
        if (id && name) {
          pools.push({
            id,
            name
          });
        }
      });
      return pools;
    }),
  metadata: procedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ input }) => {
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=${input.id}`)
        .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);
      const subtitle = $($('#content > div.main > h5')[0])
        .text()
        .trim()
        .split('—');
      const year = subtitle[0].trim().split(' ')[0];
      return {
        name: $('#content > div.main > h2').text().trim(),
        location: subtitle[1].trim(),
        year
      };
    }),
  threats: procedure
    .input(z.object({
      tournId: z.number(),
      eventId: z.number(),
      circuitId: z.number(),
      seasonId: z.number()
    }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/tourn/fields.mhtml?tourn_id=${input.tournId}&event_id=${input.eventId}`)
      .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);
      const teamLastNames: string[][] = [];
      const teamCodes: string[] = [];
      $('tr').each((idx, row) => {
        if (idx === 0) return;
        $(row).find('td').each((idx, cell) => {
          if (idx === 2) {
            teamLastNames.push($(cell).text().trim().split(' & '));
          } else if (idx === 3) {
            teamCodes.push($(cell).text().trim());
          }
        });
      });

      const getRank = async (teamId: string) => {
        const circuitRank = await (await db).query(`
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
        `, [input.circuitId, input.seasonId, teamId]) as unknown as [
            (TeamRanking & { circuitRank: number })[],
            object[],
          ];
        return circuitRank[0][0];
      };

      const teams = (await Promise.all(teamLastNames.map(async (lastNames, idx) => {
        const team = await prisma.team.findFirst({
          where: {
            AND: lastNames.map(lastName => ({
              competitors: {
                some: {
                  name: {
                    endsWith: lastName
                  }
                }
              }
            }))
          },
          include: {
            results: {
              include: {
                speaking: true,
                bid: true
              },
              where: {
                ...(input.seasonId && {
                  tournament: {
                    seasonId: {
                      equals: input.seasonId
                    }
                  }
                })
              }
            },
          }
        });

        if (team) {
          const rank = (await getRank(team.id)) as TeamRanking & { circuitRank: number };
          return {...team, rank: rank ? rank : null}
        } else {
          return team;
        }
      })));

      type Team = typeof teams[0];
      const teamsWithCodes = teams.map((team, idx) => ({ code: teamCodes[idx], ...team })) as (Team & { code: string })[];

      return [
        ...teamsWithCodes
          .filter(t => !!t.id)
          .sort((a, b) => (a?.rank?.circuitRank || Infinity) - (b?.rank?.circuitRank || Infinity)),
        ...teamsWithCodes
          .filter(t => !t.id)
      ];
    }),
  strikes: procedure
    .input(z.object({
      tournId: z.number(),
      poolId: z.number(),
      seasonId: z.number(),
      circuitId: z.number()
    }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/tourn/judges.mhtml?category_id=${input.poolId}&tourn_id=${input.tournId}`)
      .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);

      const judgeNames: string[] = [];

      $('tr').each((idx, row) => {
        if (idx === 0) return;
        const names: string[] = [];
        $(row).find('td').each((idx, cell) => {
          if (idx === 1 || idx === 2) {
            names.push($(cell).text().trim());
          }
        });
        judgeNames.push(names.join(' '))
      });

      const getRank = async (judgeId: string) => {
        const circuitRank = await (await db).query(`
          SELECT * FROM (
            SELECT
              RANK() OVER (ORDER BY \`index\` DESC, t.numRounds DESC) AS circuitRank,
              \`index\`,
              judge_id
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
            ) q WHERE q.judge_id = ?;
        `, [input.circuitId, input.seasonId, input.circuitId, input.seasonId, judgeId]) as unknown as [
            (JudgeRanking & { circuitRank: number })[],
            object[],
          ];
        return circuitRank[0][0];
      };

      const judges = await Promise.all(judgeNames.map(async (name, idx) => {
        const judge = await prisma.judge.findFirst({
          where: {
            name: {
              equals: name
            }
          },
          include: {
            results: true,
          }
        });

        if (judge) {
          const rank = await getRank(judge.id);
          return { ...judge, rank: rank ? rank : null}
        }
      }));

      type Judge = typeof judges[0];

      const judgesWithCodes = judges.map((judge, idx) => ({ ...judge, name: judgeNames[idx] })) as (Judge & { name: string })[];

      return [
        ...judgesWithCodes
          .filter(t => !!t.id)
          .sort((a, b) => (a?.rank?.circuitRank || Infinity) - (b?.rank?.circuitRank || Infinity)),
        ...judgesWithCodes
          .filter(t => !t.id)
      ];
    })
});

export default scrapingRouter;
