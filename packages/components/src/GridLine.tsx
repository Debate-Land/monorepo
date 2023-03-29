import React from 'react'

interface GridLineProps {
  position: number
  outer?: boolean
}

const GridLine = ({ position, outer }: GridLineProps) => {
  return (
    <div
      className="invisible xl:visible"
      style={{
        height: '100%',
        position: 'fixed',
        left: `${position}%`,
        top: 0,
        zIndex: -10,
        border: 'left',
        borderLeft: `1px ${outer ? 'solid' : 'dashed'} gray`,
        opacity: 0.15,
      }}
    />
  )
}

export default GridLine
