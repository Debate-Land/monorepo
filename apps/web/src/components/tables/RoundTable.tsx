import React from 'react'
import { asTable, Text } from '@shared/components'
import { ExpandedRound, ExpandedRoundJudgeRecord, ExpandedRoundSpeakerResult } from './RoundByRoundTable'



export interface RoundTableProps {
  data: ExpandedRound
}

const RoundTable = ({ data: {judgeRecords, speaking, ...round } }: RoundTableProps) => {
  const { Table: JudgeRecordTable, Attribute: JudgeRecordAttribute } = asTable<ExpandedRoundJudgeRecord>();
  const { Table: SpeakingResultTable, Attribute: SpeakingResultAttribute } = asTable<ExpandedRoundSpeakerResult>();

  return judgeRecords.length
    ? (
      <JudgeRecordTable data={(judgeRecords)}>
        <JudgeRecordAttribute
          header="Jud."
          value={{ literal: (d) => d.judge.name }}
          description='Judge'
        />
        <JudgeRecordAttribute
          header="Dec."
          value={{ literal: (d) => d.decision }}
          description='Judge Decision'
        />
        <JudgeRecordAttribute
          header="Spk."
          value={{
            literal: () => 0,
            display: (d) => {
              let speakingResults: ExpandedRoundSpeakerResult[] = speaking
                .filter((result) => result.judgeId == d.judge.id);

              return speakingResults.length
                ? (
                  <SpeakingResultTable data={speakingResults}>
                    <SpeakingResultAttribute
                      header="Comp."
                      value={{ literal: (d) => d.competitor.name }}
                      description="Competitor Name"
                    />
                    <SpeakingResultAttribute
                      header="Pts."
                      value={{ literal: (d) => d.points }}
                      description="Speaker Points"
                    />
                  </SpeakingResultTable>
                  )
                : <Text>--</Text>
            }
          }}
          description='Round Speaking Data'
        />
      </JudgeRecordTable>
    )
    : (
      <div className="w-full flex justify-center">
        <Text>
          No judging details for {round.nameStd}!
        </Text>
      </div>
    )
}

export default RoundTable
