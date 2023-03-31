import React, { ReactNode } from 'react'
import clsx from 'clsx'
import Text from './Text'

export interface CardProps {
  title: string
  children: ReactNode
  icon?: ReactNode
  className?: string
  [key: string]: any
}

const Card = ({ title, icon, children, className, ...props }: CardProps) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={clsx(className, 'rounded-md md:border border-gray-400/50 backdrop-blur-3xl mx-2')} {...props}>
      <div className="p-1 md:p-5">
        <Text as="h3" className="!text-indigo-400 bold -mb-2 md:mb-2 flex items-center text-2xl sm:text-3xl lg:text-4xl">
          {icon}
          {icon && <span className="mx-1" />}
          {title}
        </Text>
        <div className="flex flex-col justify-between space-y-3">{children}</div>
      </div>
    </div>
  )
}

export default Card
