import React, { useEffect, useMemo, useState } from 'react'
import { ExpandedTournamentResult } from '../tables/team/TournamentHistoryTable';
import { Button, Card, Chart, Text } from '@shared/components';
import { AiOutlineLineChart } from 'react-icons/ai';
import { getDeflator } from '@src/utils/get-statistics';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

interface TeamChartsProps {
  results: ExpandedTournamentResult[];
}

const TeamCharts = ({ results }: TeamChartsProps) => {
  const [ready, setReady] = useState<boolean>(false);
  const [mode, setMode] = useState<"Point" | "Cumulative">("Point");

  useEffect(() => {
    setReady(true);
  }, []);

  const getShortDate = (_date: number) => {
    const date = new Date(_date);
    const year = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);

    return `${month}/${year}`;
  }

  const pwpPoint = useMemo(() => {
    return results.map(r => ({
      date: getShortDate(r.tournament.start * 1000),
      pwp: Math.floor(r.prelimBallotsWon / (r.prelimBallotsLost + r.prelimBallotsWon) * 100)
    }))
  }, [results]);

  const pwpCum = useMemo(() => {
    return results.map((r, idx) => {
      const previousResults = results.slice(0, idx + 1).map(r => [r.prelimBallotsWon, r.prelimBallotsLost]);
      const pWinsSum = previousResults.reduce((p, c) => p + c[0], 0);
      const pLossesSum = previousResults.reduce((p, c) => p + c[1], 0);

      return {
        date: getShortDate(r.tournament.start * 1000),
        pwp: Math.round(pWinsSum / (pWinsSum + pLossesSum) * 100)
      }
    })
  }, [results]);

  const speaksPoint = useMemo(() => {
    return results.map(r => {
      const speaks = r.speaking.map(s => s.rawAvgPoints);
      if (!speaks.length) return null;
      return {
        date: getShortDate(r.tournament.start * 1000),
        speaks: Math.round(speaks.reduce((p, c) => p + c, 0) / speaks.length * 100)/100
      }
    }).filter(r => r !== null) as {date: string, speaks: number}[];
  }, [results]);

  const speaksCum = useMemo(() => {
    return results.map((r, idx) => {
      const previousResults = results
        .slice(0, idx + 1)
        .map(r => r.speaking.map(s => s.rawAvgPoints)
        .reduce((a, b) => a + b, 0) / r.speaking.length);

      const speaksSum = previousResults.reduce((p, c) => p + c, 0);

      return {
        date: getShortDate(r.tournament.start * 1000),
        speaks: Math.round(speaksSum / previousResults.length * 100) / 100
      }
    })
  }, [results]);

  const prelimPoolPctlPoint = useMemo(() => {
    return results.map(r => ({
      date: getShortDate(r.tournament.start * 1000),
      pctl: 100 - Math.round(r.prelimPos / r.prelimPoolSize * 100)
    }))
  }, [results]);

  const prelimPoolPctlCum = useMemo(() => {
    return results.map((r, idx) => {
      const previousResults = results
        .slice(0, idx + 1)
        .map(r => 100 - Math.round(r.prelimPos / r.prelimPoolSize * 100));

      const pctlSum = previousResults.reduce((p, c) => p + c, 0);

      return {
        date: getShortDate(r.tournament.start * 1000),
        pctl: Math.round(pctlSum / previousResults.length * 100) / 100
      }
    })
  }, [results]);

  const otrPoint = useMemo(() => {
    return results.map(r => ({
      date: getShortDate(r.tournament.start * 1000),
      otr: Math.round(r.otrComp * 100) / 100
    }))
  }, [results]);

  const otrCum = useMemo(() => {
    return results.map((r, idx) => {
      const previousResults = results.slice(0, idx + 1).map(r => r.otrComp);
      const otrSum = previousResults.reduce((p, c) => p + c, 0);
      return {
        date: getShortDate(r.tournament.start * 1000),
        otr: Math.round(getDeflator(previousResults.length) * otrSum / previousResults.length * 100) / 100
      }
    })
  }, [results]);

  const breakPoint = useMemo(() => {
    return results.map(r => {
      if (!r.tournament.hasElimRounds) {
        return null;
      }

      return {
        date: getShortDate(r.tournament.start * 1000),
        break: (r.elimBallotsWon !== 0 || r.elimBallotsLost !== 0)
          ? 1
          : 0
      }
    }).filter(v => v !== null) as { date: string; break: number}[];
  }, [results]);

  const breakCum = useMemo(() => {
    return results.map((r, idx) => {
      const previousResults = results
        .slice(0, idx + 1)
        .filter(r => r.tournament.hasElimRounds)
        .map(r => r.elimBallotsLost !== 0 || r.elimBallotsWon !== 0);

      const numBreaks = previousResults.reduce((p, c) => c ? p + 1 : p, 0);

      return {
        date: getShortDate(r.tournament.start * 1000),
        pct: Math.round(numBreaks / previousResults.length * 100)
      }
    })
  }, [results]);

  const twpPoint = useMemo(() => {
    return results.map(r => {
      const _twp = (r.prelimBallotsWon + r.prelimBallotsLost) / (r.prelimBallotsWon + r.prelimBallotsLost + (r.elimBallotsWon || 0) + (r.elimBallotsLost || 0)) + (r.elimBallotsWon || 0) / ((r.elimBallotsWon || 0) + (r.elimBallotsLost || 0)) * 0.1;

      return {
        date: getShortDate(r.tournament.start * 1000),
          twp: _twp < 1 ? Math.round(_twp * 100) : 1
      }
    })
  }, [results]);

  const twpCum = useMemo(() => {
    return results.map((r, idx) => {
      const previousResults = results
        .slice(0, idx + 1)
        .map(r => [[r.prelimBallotsWon, r.prelimBallotsLost], [r.elimBallotsWon || 0, r.elimBallotsLost || 0]]);

      const sumPrelimsWon = previousResults.reduce((p, c) => p + c[0][0], 0);
      const sumPrelimsLost = previousResults.reduce((p, c) => p + c[0][1], 0);

      const sumElimsWon = previousResults.reduce((p, c) => p + c[1][0], 0);
      const sumElimsLost = previousResults.reduce((p, c) => p + c[1][1], 0);

      const _twp = (sumPrelimsWon + sumElimsWon) / (sumPrelimsWon + sumPrelimsLost + sumElimsWon + sumElimsLost) + sumElimsWon / (sumElimsWon + sumElimsLost) * 0.1;

      return {
        date: getShortDate(r.tournament.start * 1000),
        twp: _twp < 1 ? Math.round(_twp * 100) : 1
      };
    })
  }, [results]);

  return (
    <Card icon={<AiOutlineLineChart />} title="Analytics" className="relative max-w-[800px] mx-auto my-16">
      <div className="w-full grid md:grid-cols-2 gap-4 max-w-[620px] mx-auto">
        {ready && (
          <>
            <Chart
              title="Prelim Win Pct."
              data={mode === "Cumulative" ? pwpCum : pwpPoint}
              xKey="date"
              yKey="pwp"
              range={[0, 100]}
              isPercentage
            />
            <Chart
              title="Raw Speaks"
              data={mode === "Cumulative" ? speaksCum : speaksPoint}
              xKey="date"
              yKey="speaks"
              range={[20, 30]}
            />
            <Chart
              title="Prelim Pool Pctl."
              data={mode === "Cumulative" ? prelimPoolPctlCum : prelimPoolPctlPoint}
              xKey="date"
              yKey="pctl"
              range={[0, 100]}
              isPercentage
            />
            <Chart
              title={mode === "Cumulative" ? "OTR Score" : "OTR Comp"}
              data={mode === "Cumulative" ? otrCum : otrPoint}
              xKey="date"
              yKey="otr"
              range={[0, 5]}
            />
            <Chart
              title={mode === "Cumulative" ? "Break Pct." : "Break (y/n)"}
              data={mode === "Cumulative" ? breakCum : breakPoint}
              xKey="date"
              yKey={mode === "Cumulative" ? "pct" : "break"}
              range={mode === "Cumulative" ? [0, 100] : [0, 1]}
              isPercentage={mode === "Cumulative"}
              isBoolean
            />
            <Chart
              title="True Win Pct."
              data={mode === "Cumulative" ? twpCum : twpPoint}
              xKey="date"
              yKey="twp"
              range={[0, 100]}
              isPercentage
            />
          </>
        )}
        {!ready && [1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="ml-[20px] w-[280px] h-[200px] rounded-lg bg-gray-200 animate-pulse"></div>
        ))}
        <Button
          icon={<HiOutlineSwitchHorizontal className='mr-2' />}
          onClick={() => setMode(mode === "Cumulative" ? "Point" : "Cumulative")}
          className='h-7 absolute top-0 md:top-5 right-5'
          ghost
        >
          {mode}
        </Button>
      </div>
    </Card>
  )
}

export default TeamCharts