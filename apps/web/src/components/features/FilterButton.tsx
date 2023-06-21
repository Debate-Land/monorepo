import React from 'react'
import { VscArrowSwap } from 'react-icons/vsc';

interface FilterButtonProps {
  setIsOpen(isOpen: boolean): void;
  children: any
}

const FilterButton = ({ setIsOpen, children }: FilterButtonProps) => {
  return (
      <div className="flex items-center space-x-1 lg:space-x-2">
        <p>{children}</p>
        <button
          className="p-[2px] lg:p-1 bg-gradient-to-r from-sky-400 via-purple-500 to-red-400 rounded group-hover:shadow-halo group-hover:scale-110 transition-all"
          onClick={() => setIsOpen(true)}
        >
          <VscArrowSwap className="text-white" />
        </button>
    </div>
  )
}

export default FilterButton