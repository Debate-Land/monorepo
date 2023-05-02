import clsx from 'clsx'
import React, { ChangeEventHandler, ReactNode } from 'react'

export interface InputProps {
  onChange: ChangeEventHandler<HTMLInputElement> & ChangeEventHandler<HTMLTextAreaElement>
  onSubmit?(text: string): void
  as?: "input" | "textarea"
  placeholder?: string
  label?: ReactNode
  className?: string
  disabled?: boolean
  [key: string]: any
}

const Input = ({ as = "input", placeholder, onChange, label, onSubmit, className, disabled, ...props }: InputProps) => {
  const Tag = as;

  return (
    <div className="w-full grow">
      {label}
      <Tag
        onSubmit={(e: any) => onSubmit && onSubmit(e.target.value)}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          className,
          'px-3 py-1 rounded-lg focus:outline-none dark:text-white dark:bg-slate-800/90',
          {
            'cursor-not-allowed opacity-50': disabled
          }
        )}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </div>
  )
}

export default Input
