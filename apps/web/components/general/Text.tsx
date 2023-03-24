import clsx from 'clsx'
import React, { ReactNode } from 'react'

export interface TextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'legend' | 'th' | 'tr'
  capitalize?: boolean
  children: string | ReactNode
  font?: 'sans' | 'serif' | 'mono'
  italic?: boolean
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  position?: 'left' | 'center' | 'right'
  className?: string
  tooltip?: string
  [key: string]: any
}

const Text = ({
  as,
  capitalize,
  children,
  font,
  italic,
  weight,
  size,
  position,
  className,
  tooltip,
  ...props
}: TextProps) => {
  const Tag = as || 'p'

  return (
    <Tag
      className={clsx(
        {
          italic,
          capitalize,
        },
        {
          'text-xs': size === 'xs',
          'text-sm': size === 'sm',
          'text-base': size === 'base',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
          'text-2xl': size === '2xl',
          'text-3xl': size === '3xl',
          'text-4xl': size === '4xl',
          'text-5xl': size === '5xl',
          'text-6xl': size === '6xl',
          'text-7xl': size === '7xl',
        },
        {
          'font-light': weight === 'light',
          'font-normal': weight === 'normal',
          'font-medium': weight === 'medium',
          'font-semibold': weight === 'semibold',
          'font-bold': weight === 'bold',
        },
        {
          'font-sans': font === 'sans',
          'font-serif': font === 'serif',
          'font-mono': font === 'mono',
        },
        {
          'text-left': position === 'left',
          'text-center': position === 'center',
          'text-right': position === 'right',
        },
        {
          'group relative duration-300 hover:z-100': tooltip
        },
        className
      )}
      {...props}
    >
      {children}
      {
        tooltip && (
          <div className="z-10 absolute hidden md:group-hover:flex -top-2 -left-32 translate-x-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-700">
            <p>{tooltip}</p>
          </div>
        )
      }
    </Tag>
  )
}

export default Text
