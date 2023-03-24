import clsx from 'clsx'
import React, { ReactNode } from 'react'
import Label from './Label'
import Text from './Text'

export interface SelectProps {
  onChange(value: string, index: number): void
  options: string[]
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
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {options.map((val) => (
          <option value={val} key={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
