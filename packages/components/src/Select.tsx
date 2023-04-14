import clsx from 'clsx'
import React, { ReactNode } from 'react'

interface Option {
  name: string;
  value: any;
};

export interface SelectProps {
  onChange(value: string, index: number): void
  options: Option[]
  initial?: string
  label?: ReactNode
  className?: string
  [key: string]: any
}

const Select = ({ onChange, options, className, initial, label, ...props }: SelectProps) => {
  const elem = React.useRef(null)

  const handleChange = () => {
    if (!elem.current) return
    // @ts-ignore
    onChange(elem.current.value, elem.current.selectedIndex)
  }

  return (
    <div className="flex flex-col items-start justify-start">
      {label}
      <select
        className={clsx(
          className,
          'px-3 py-1 rounded-md  focus:outline-none w-full sm:w-[150px] dark:bg-gray-800 dark:border-gray-600 dark:text-white',
        )}
        onChange={handleChange}
        defaultValue={initial}
        ref={elem}
        {...props}
      >
        {options.map(({name, value}, idx) => (
          <option value={value} key={idx}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
