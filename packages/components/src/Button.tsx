import clsx from 'clsx'
import React, { ReactNode } from 'react'

export interface ButtonProps {
  onClick?(): void
  icon?: ReactNode
  _type?: 'default' | 'secondary' | 'primary'
  className?: string
  children?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  ghost?: boolean
  [key: string]: any
}

const Button = ({ onClick, icon, ghost, _type, children, size, className, ...props }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        className,
        'px-5 py-1 rounded-md mx-5 capitalize flex justify-center items-center',
        ghost
          ? {
            'border hover:text-white': true,
            'border-sky-800 text-sky-800 hover:bg-sky-800': _type == 'primary',
            'border-teal-600 text-teal-600 hover:bg-teal-600': _type == 'secondary',
            'border-gray-900 text-gray-900 hover:bg-gray-900': !_type || _type == 'default',
          }
          : {
            'text-white': true,
            'bg-gradient-to-r from-sky-400 via-purple-500 to-red-400 rounded-xl': _type == 'primary',
            'bg-teal-600': _type == 'secondary',
            'bg-gray-900': !_type || _type == 'default',
          },
        {
          'text-sm px-3 w-[100px]': size === 'sm',
          'text-lg w-[150px]': size === 'lg',
          'text-xl py-2 w-[200px]': size === 'xl',
        },
        {
          '!p-2': icon,
          'dark:text-gray-900 dark:bg-gray-300 dark:border-gray-600': _type == 'default' || !_type,
          'hover:opacity-80': _type !== 'primary',
          'hover:shadow-halo transition-all': _type === 'primary'
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
