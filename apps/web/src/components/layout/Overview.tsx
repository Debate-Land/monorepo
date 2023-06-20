import React from 'react'
import { Button, Loader, Text } from '@shared/components'
import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';
import { omit } from 'lodash';

interface OverviewProps {
  label: string | JSX.Element;
  heading?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  subheading?: string;
  underview: JSX.Element;
}

const BACK_PATHS = [
  "/teams/[id]",
  "/judges/[id]"
]

const Overview = (props: OverviewProps) => {
  const { query, pathname, push } = useRouter();

  return (
    <div className="w-full flex flex-col bg-luka-100 overflow-hidden relative">
      {
        BACK_PATHS.includes(pathname) &&
        <div className="!cursor-pointer absolute top-5 left-5 z-20 w-6 h-6 flex justify-center items-center bg-gradient-to-r from-sky-400 via-purple-500 to-red-400 rounded-full">
          <button
            onClick={() => push({
              pathname: '/dataset',
              query: omit(query, ['id', 'topics', 'topicTags'])
            })}
          >
            <IoMdArrowBack size={18} className="text-white" />
          </button>
        </div>
      }
      <div className="absolute bg-grid bg-fixed inset-0" />
      <span className="md:h-[4rem]" />
      <div className="flex justify-center items-center w-full bg-luka-100 py-6">
        <div
          id="overview"
          className="group flex flex-col md:flex-row items-center md:items-start lg:w-[1050px] justify-between lg:justify-center px-2 lg:px-0 pb-4"
        >
          <span id="entry-info" className="flex flex-col items-center md:items-start w-full md:w-[50%] p-2 relative">
            <div id="blob1" className='absolute hidden lg:block -top-50 right-0 w-72 h-72 bg-yellow-600 rounded-full mix-blend-lighten filter blur-xl' />
            <div id="blob2" className='absolute hidden lg:block top-50 right-100 w-72 h-72 bg-sky-500 rounded-full mix-blend-lighten filter blur-xl' />
            <div id="blob2" className='absolute hidden lg:block -top-8 right-28 w-72 h-72 bg-purple-500 rounded-full mix-blend-lighten filter blur-xl' />
            <Text size="sm" className="mb-1 bg-violet-300/70 px-2 !text-white rounded-xl z-20">
              {props.label}
            </Text>
            <Text className="text-xl !text-white sm:text-3xl lg:text-4xl min-w-[500px] mx-auto text-center md:text-left z-20">
                {props.heading || <Loader height={8} width="full"/>}
            </Text>
            {
              props.subheading && (
                <Text className="text-md !text-white sm:text-xl lg:text-2xl min-w-[500px] mx-auto text-center md:text-left z-20">
                  {props.subheading}
                </Text>
              )
            }

          </span>
          <Text className="!text-indigo-300 md:mt-4 text-xs md:text-md lg:text-lg z-20">
              {props.subtitle || <Loader height={4} width={64} />}
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