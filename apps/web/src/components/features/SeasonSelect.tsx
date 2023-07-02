import { Listbox, Transition } from "@headlessui/react";
import { Season } from "@shared/database";
import { trpc } from "@src/utils/trpc";
import React, { Fragment, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { LuChevronsUpDown } from "react-icons/lu";

export interface SeasonSelectProps {
  selected: Season | undefined;
  setSelected(selected: Season | undefined): void;
}

const SeasonSelect = ({ selected, setSelected }: SeasonSelectProps) => {
  const { data } = trpc.feature.seasons.useQuery({});
  console.log(selected);

  return (
    <div className="sm:absolute top-0 right-1 md:top-5 md:right-5">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-[2px] w-full">
          <Listbox.Button className="relative w-full sm:w-36 cursor-default h-8 rounded bg-white dark:bg-slate-800 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
            <span className="w-full flex justify-between first-letter:pointer-events-none absolute inset-y-0 right-0 items-center px-2">
              <span className="block truncate text-xs md:text-auto">
                {selected?.id || "All seasons"}
              </span>
              <LuChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-40 absolute max-h-60 w-full max-w-96 overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <Listbox.Option
                value={{
                  id: undefined,
                }}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 text-black dark:text-white ${
                    active ? "bg-blue-200 dark:bg-blue-600" : "text-gray-900"
                  }`
                }
              >
                {({ selected: itemSelected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        itemSelected ? "font-medium" : "font-normal"
                      }`}
                    >
                      All seasons
                    </span>
                    {itemSelected || !selected?.id ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active
                            ? "text-teal-600 dark:text-teal-300"
                            : "text-teal-600"
                        }`}
                      >
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
              {data?.map((o) => (
                <Listbox.Option
                  key={o.id}
                  value={o}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 text-black dark:text-white ${
                      active ? "bg-blue-200 dark:bg-blue-600" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {o.id}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active
                              ? "text-teal-600 dark:text-teal-300"
                              : "text-teal-600"
                          }`}
                        >
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default SeasonSelect;
