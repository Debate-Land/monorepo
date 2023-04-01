import React from 'react'
import { Text } from '@shared/components'

interface OverviewProps {
  label: string;
  heading: string;
  subtitle: string;
  underview: JSX.Element;
}

const Overview = (props: OverviewProps) => {
  return (
    <div className="w-full flex flex-col bg-luka-100 overflow-hidden">
    <span className="h-[4rem]" />
    <div className="flex justify-center items-center w-full bg-luka-100 py-6">
      <div
        id="overview"
        className="flex flex-col md:flex-row items-center md:items-start lg:w-[1050px] justify-between lg:justify-center px-2 lg:px-0 pb-4"
      >
        <span id="entry-info" className="flex flex-col items-center md:items-start w-full md:w-[50%] p-2 relative">
          <div id="blob1" className='absolute hidden lg:block -top-50 right-0 w-72 h-72 bg-yellow-600 rounded-full mix-blend-lighten filter blur-xl' />
          <div id="blob2" className='absolute hidden lg:block top-50 right-100 w-72 h-72 bg-sky-500 rounded-full mix-blend-lighten filter blur-xl' />
          <div id="blob2" className='absolute hidden lg:block -top-8 right-28 w-72 h-72 bg-purple-500 rounded-full mix-blend-lighten filter blur-xl' />
          <Text size="sm" className="mb-1 bg-violet-300/70 px-2 !text-white rounded-xl">
            {props.label}
          </Text>
          <Text className="text-xl sm:text-3xl lg:text-4xl min-w-[500px] mx-auto text-center md:text-left flex flex-col md:flex-0">
              {props.heading}
          </Text>
        </span>
        <Text size="lg" className="!text-indigo-300 md:mt-4">
            {props.subtitle}
        </Text>
      </div>
    </div>
    <div className="w-full flex justify-center border-y border-gray-300/40 bg-luka-200 z-20">
        {props.underview}
    </div>
  </div>
  )
}

export default Overview