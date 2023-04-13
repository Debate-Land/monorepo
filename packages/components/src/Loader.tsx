import React from 'react'

interface LoaderProps {
  width: number | string;
  height: number | string;
  lines?: number;
}

const Loader = ({width, height, lines = 1}: LoaderProps) => {
  return (
    <>
      {
        Array.apply(null, Array(lines)).map((_, idx) => (
          <p key={idx} className={`bg-gray-300/40 dark:bg-gray-700/40 animate-pulse rounded w-${width} h-${height}`} />
        ))
      }
    </>
  )
}

export default Loader