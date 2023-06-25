import { z } from 'zod';
import { procedure, router } from '../trpc';
import * as cheerio from 'cheerio';

interface SearchResult {
  id: number;
  date: Date;
  name: string;
};

interface Option {
  id: number;
  name: string;
}

const scrapingRouter = router({
  tournament: procedure
    .input(z.object({
      search: z.string()
    }))
    .query(async ({ input }) => {
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/search.mhtml?search=${input.search}`)
        .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);
      const results: SearchResult[] = [];
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
        results.push(result as SearchResult);
      });
      return results;
    }),
  entries: procedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ input }) => {
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/tourn/fields.mhtml?tourn_id=${input.id}`)
        .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);
      const events: Option[] = [];
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
    .query(async ({ input }) => {
      const tabroomResponse = await fetch(`https://www.tabroom.com/index/tourn/judges.mhtml?tourn_id=${input.id}`)
        .then(res => res.text());
      const $ = cheerio.load(tabroomResponse);
      const pools: Option[] = [];
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
      return {
        name: $('#content > div.main > h2').text().trim(),
        location: $('#content > div.main > h5').text().trim()
      };
    }),
  threats: procedure
    .input(z.object({
      tournId: z.number(),
      eventId: z.number(),
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
        })
      });
      const teams = (await Promise.all(teamLastNames.map((lastNames, idx) => prisma.team.findFirst({
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
            }
          },
          rankings: {
            orderBy: {
              otr: 'desc'
            },
            take: 1,
            include: {
              circuit: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }))));

      type Team = typeof teams[0];

      return (teams
        .map((team, idx) => ({ code: teamCodes[idx], ...team })) as (Team & { code: string })[])
        .sort((a, b) => (b?.rankings[0]?.otr || 0) - (a?.rankings[0]?.otr || 0));
    }),
  strikes: procedure
    .input(z.object({
      tournId: z.number(),
      poolId: z.number(),
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

      const judges = await Promise.all(judgeNames.map((name, idx) => prisma.judge.findFirst({
        where: {
          name: {
            equals: name
          }
        },
        include: {
          results: true,
          rankings: {
            orderBy: {
              index: 'desc'
            },
            take: 1,
            include: {
              circuit: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })));

      type Judge = typeof judges[0];

      return (judges
        .map((judge, idx) => ({ ...judge, name: judgeNames[idx] })) as (Judge & { name: string })[])
        .sort((a, b) => (b?.rankings[0]?.index || 0) - (a?.rankings[0]?.index || 0));
    })
});

export default scrapingRouter;
