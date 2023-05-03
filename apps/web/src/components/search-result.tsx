import React from 'react'

interface SearchResultProps {
  name: string;
  tag: string;
  onClick(): void;
}

const SearchResult = ({name, tag, onClick}: SearchResultProps) => {
  return (
    <div
      className="transition-all w-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-100/30 rounded flex flex-row justify-between pl-3 pr-1 py-1 items-center"
      onClick={onClick}
    >
      <p className="w-48 md:w-fit">{name}</p>
      <p className="bg-red-400/80 !text-white text-sm rounded p-1 w-32 min-w-32 text-center">{tag}</p>
    </div>
  )
}

export default SearchResult;
