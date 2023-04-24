import clsx from 'clsx'
import React, { ChangeEventHandler, ReactNode } from 'react'

export interface InputProps {
  onChange: ChangeEventHandler<HTMLInputElement> & ChangeEventHandler<HTMLTextAreaElement>
  onSubmit?(text: string): void
  as?: "input" | "textarea"
  placeholder?: string
  label?: ReactNode
  className?: string
  [key: string]: any
}

const Input = ({ as = "input", placeholder, onChange, label, onSubmit, className, ...props }: InputProps) => {
  const Tag = as;

  return (
    <div className="w-full grow">
      {label}
      <Tag
        onSubmit={(e: any) => onSubmit && onSubmit(e.target.value)}
        placeholder={placeholder}
        onChange={onChange}
        className={clsx(className, ' px-3 py-1 rounded-lg focus:outline-none dark:text-white dark:bg-slate-800/90')}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </div>
  )
}

export default Input
