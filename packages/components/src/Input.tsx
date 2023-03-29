import clsx from 'clsx'
import React, { ReactNode } from 'react'

export interface InputProps {
  onChange(text: string): void
  onSubmit?(text: string): void
  placeholder?: string
  label?: ReactNode
  className?: string
  [key: string]: any
}

const Input = ({ placeholder, onChange, label, onSubmit, className, ...props }: InputProps) => {
  return (
    <div className="w-full grow">
      {label}
      <input
        onSubmit={(e: any) => onSubmit && onSubmit(e.target.value)}
        placeholder={placeholder}
        onChange={(e: any) => onChange(e.target.value)}
        className={clsx(className, ' px-3 py-1 rounded-lg focus:outline-none dark:text-white dark:bg-slate-800/90')}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </div>
  )
}

export default Input
