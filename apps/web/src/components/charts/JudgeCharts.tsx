import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Chart, Text } from '@shared/components';
import { AiOutlineLineChart } from 'react-icons/ai';
import { getDeflator } from '@src/utils/get-statistics';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import clsx from 'clsx';
import { BiErrorCircle } from 'react-icons/bi';
import { ExpandedJudgeTournamentResult } from '../tables/judge/JudgingHistoryTable';

interface JudgeChartsProps {
  results: ExpandedJudgeTournamentResult[];
}

const JudgeCharts = ({ results }: JudgeChartsProps) => {
  const [ready, setReady] = useState<boolean>(false);
  const [mode, setMode] = useState<"Point" | "Cumulative">("Cumulative");

  useEffect(() => {
    setReady(true);
  }, []);

  const pctProPoint = useMemo(() => {
    return results.map(r => ({
      date: r.tournament.start * 1000,
      pctPro: Math.floor(((r.numAff || 0) + (r.numPro || 0)) / ((r.numAff || 0) + (r.numPro || 0) + (r.numNeg || 0) + (r.numCon || 0))  * 100)
    }))
  }, [results]);

  const pctProCum = useMemo(() => {
    return results.map((r, idx) => {
      const previousResults = results.slice(0, idx + 1).map(r => [(r.numPro || 0) + (r.numAff || 0), (r.numCon || 0) + (r.numNeg || 0)]);
      const pProSum = previousResults.reduce((p, c) => p + c[0], 0);
      const pConSum = previousResults.reduce((p, c) => p + c[1], 0);

      return {
        date: r.tournament.start * 1000,
        pctPro: Math.round(pProSum / (pProSum + pConSum) * 100)
      }
    })
  }, [results]);

  const speaksPoint = useMemo(() => {
    return results.map(r => {
      if (!r.avgRawPoints) return null;
      return {
        date: r.tournament.start * 1000,
        speaks: Math.round(r.avgRawPoints * 10)/10
      }
    }).filter(r => r !== null) as {date: number, speaks: number}[];
  }, [results]);

  const speaksCum = useMemo(() => {
    return results.map((r, idx) => {
      const speaks = results
        .slice(0, idx + 1)
        .map(r => r.avgRawPoints)
        .filter(s => s !== null) as number[];

      return {
        date: r.tournament.start * 1000,
        speaks: Math.round(speaks.reduce((a, b) => a + b, 0) / speaks.length * 10) / 10
      }
    })
  }, [results]);

  const stdDevSpeaksPoint = useMemo(() => {
    return results.map(r => {
      if (!r.stdDevPoints) return null;
      return {
        date: r.tournament.start * 1000,
        stdDevSpeaks: Math.round(r.stdDevPoints * 10) / 10
      }
    }).filter(r => r !== null) as {date: number, stdDevSpeaks: number}[];
  }, [results]);

  const stdDevSpeakCum = useMemo(() => {
    return results.map((r, idx) => {
      const speaks = results
        .slice(0, idx + 1)
        .map(r => r.stdDevPoints)
        .filter(s => s !== null) as number[];
      const speakSum = speaks.reduce((a, b) => a + b, 0);

      return {
        date: r.tournament.start * 1000,
        stdDevSpeaks: Math.round(speakSum / speaks.length * 10) / 10
      }
    })
  }, [results]);

  const squirrelsAndScrewsPoint = useMemo(() => {
    return results.map(r => ({
      date: r.tournament.start * 1000,
      squirrelsAndScrews: (r.numPrelimScrews || 0) + (r.numSquirrels || 0)
    }))
  }, [results]);

  const squirrelsAndScrewsCum = useMemo(() => {
    return results.map((r, idx) => {
      const numSquirrelsAndScrews = results
        .slice(0, idx + 1)
        .map(r => (r.numPrelimScrews || 0) + (r.numSquirrels || 0))
        .reduce((p, c) => p + c, 0);

      return {
        date: r.tournament.start * 1000,
        squirrelsAndScrews: numSquirrelsAndScrews
      }
    })
  }, [results]);

  return (
    <Card icon={<AiOutlineLineChart />} title="Analytics" className="relative max-w-[800px] mx-auto my-16">
      <div
        className={clsx(
          "max-w-[620px] mx-auto w-fit grid",
          {
            "sm:grid-cols-2 gap-4 sm:ml-8 md:ml-12 ": !ready || results.length > 1,
            "grid place-items-center h-32 md:h-96 w-full": ready && results.length < 2,
          }
        )}
      >
        {ready && results.length > 1 && (
          <>
            <Chart
              title="Pct. Pro/Aff"
              data={mode === "Cumulative" ? pctProCum : pctProPoint}
              xKey="date"
              yKey="pctPro"
              range={[0, 100]}
              yTicks={[0, 25, 50, 75, 100]}
              isPercentage
            />
            <Chart
              title="Raw Speaks"
              data={mode === "Cumulative" ? speaksCum : speaksPoint}
              xKey="date"
              yKey="speaks"
              yTicks={[20, 22, 24, 26, 28, 30]}
              range={[20, 30]}
            />
            <Chart
              title="σ Speaks"
              data={mode === "Cumulative" ? stdDevSpeakCum : stdDevSpeaksPoint}
              xKey="date"
              yKey="stdDevSpeaks"
              range={[0, 2]}
              yTicks={[0, 0.5, 1, 1.5, 2]}
            />
            <Chart
              title="# Squirrels/Screws"
              data={mode === "Cumulative" ? squirrelsAndScrewsCum : squirrelsAndScrewsPoint}
              xKey="date"
              yKey="squirrelsAndScrews"
              yTicks={[0, 2, 4, 6, 8]}
              range={[0, 8]}
            />
          </>
        )}
        {!ready && [1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="ml-[20px] w-[280px] h-[200px] rounded-lg bg-gray-200 animate-pulse"></div>
        ))}
        {
          results.length > 1 && (
            <Button
              icon={<HiOutlineSwitchHorizontal className='mr-2' />}
              onClick={() => setMode(mode === "Cumulative" ? "Point" : "Cumulative")}
              className='h-7 absolute top-0 md:top-5 right-5 !bg-transparent !text-black dark:!text-white hover:opacity-70 active:opacity-90 w-36'
              ghost
            >
              <p className='w-full text-start'>{mode}</p>
            </Button>
          )
        }
        {
          ready && results.length < 2 && (
            <div className="flex text-center space-x-1 text-gray-600 dark:text-gray-400">
              <BiErrorCircle size={32} />
              <p className="mt-[2px] text-xl">Not enough history</p>
            </div>
          )
        }
      </div>
    </Card>
  )
}

export default JudgeCharts