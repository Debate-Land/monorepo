import React from 'react'
import { Card, Table, Text } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { ExpandedRoundSpeakerResult } from './TournamentHistoryTable'
import { School } from '@shared/database'
import { AiOutlineInfoCircle } from 'react-icons/ai'

interface Alias {
  code: string;
}

export interface TeamInfoTableProps {
  aliases?: Alias[];
  schools?: School[];
}

const TeamInfoTable = ({ aliases, schools }: TeamInfoTableProps) => {
  const aliasColumn = createColumnHelper<Alias>()
  const schoolColumn = createColumnHelper<School>()

  return (
    <Card icon={<AiOutlineInfoCircle />} title="Team Info" className="max-w-[800px] mx-auto my-16">
      <Table
        data={schools}
        columnConfig={{
          core: [
            schoolColumn.accessor('name', {
              header: "Schools",
              cell: props => props.cell.getValue()
            })
          ] as ColumnDef<School>[]
        }}
        numLoadingRows={1}
      />
      <Table
        data={aliases}
        columnConfig={{
          core: [
            aliasColumn.accessor('code', {
              header: "Codes",
              cell: props => props.cell.getValue()
            })
          ] as ColumnDef<Alias>[]
        }}
        numLoadingRows={2}
      />
    </Card>
  )
}

export default TeamInfoTable