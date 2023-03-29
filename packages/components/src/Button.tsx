import clsx from 'clsx'
import React, { ReactNode } from 'react'

export interface ButtonProps {
  onClick(): void
  icon?: ReactNode
  type?: 'default' | 'secondary' | 'primary'
  className?: string
  children?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  ghost?: boolean
  [key: string]: any
}

const Button = ({ onClick, icon, ghost, type, children, size, className, ...props }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        className,
        'px-5 py-1 rounded-md mx-5 drop-shadow-md hover:opacity-80 capitalize flex justify-center items-center',
        ghost
          ? {
            'border hover:text-white': true,
            'border-sky-800 text-sky-800 hover:bg-sky-800': type == 'primary',
            'border-teal-600 text-teal-600 hover:bg-teal-600': type == 'secondary',
            'border-gray-900 text-gray-900 hover:bg-gray-900': !type || type == 'default',
          }
          : {
            'text-white': true,
            'bg-sky-600': type == 'primary',
            'bg-teal-600': type == 'secondary',
            'bg-gray-900': !type || type == 'default',
          },
        {
          'text-sm px-3 w-[100px]': size === 'sm',
          'text-lg w-[150px]': size === 'lg',
          'text-xl py-2 w-[200px]': size === 'xl',
        },
        {
          '!p-2': icon,
          'dark:text-gray-900 dark:bg-gray-300 dark:border-gray-600': type == 'default' || !type
        }
      )}
      type="button"
      {...props}
    >
      {icon}{children}
    </button>
  )
}

export default Button
