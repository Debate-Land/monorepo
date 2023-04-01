import React from 'react'
import { Card, asTable } from '@shared/components'
import { School } from '@shared/database';
import { TbListDetails } from 'react-icons/tb'

export interface SchoolTableProps {
  data: School[]
}

const SchoolTable = ({ data }: SchoolTableProps) => {
  const { Table, Attribute } = asTable<School>();

  return (
    <Card icon={<TbListDetails />} title="Schools" className="max-w-[800px] mx-auto my-16">
      <Table data={(data)}>
        <Attribute
          header="School"
          value={{
            literal: (d) => d.name,
          }}
          description='School name'
        />
        <Attribute
          header="--"
          value={{
            literal: '--',
          }}
        />
      </Table>
    </Card>
    )
}

export default SchoolTable
