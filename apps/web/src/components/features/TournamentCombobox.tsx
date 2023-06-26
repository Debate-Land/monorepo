import {
  Fragment,
  useCallback,
  useState,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Combobox, Transition } from "@headlessui/react";
// @ts-ignore
import { useDebounce } from "@uidotdev/usehooks";
import { LuChevronsUpDown } from "react-icons/lu";
import { HiCheck } from "react-icons/hi";
import { trpc } from "@src/utils/trpc";
import { TournamentSearchResult } from "@src/server/routers/scraping";

interface TournamentComboboxProps {
  selected: TournamentSearchResult | undefined;
  setSelected: Dispatch<SetStateAction<TournamentSearchResult | undefined>>;
}

export default function TournamentCombobox({
  selected,
  setSelected,
}: TournamentComboboxProps) {
  const [results, setResults] = useState<TournamentSearchResult[]>([]);
  const { mutateAsync: fetchResults } = trpc.scraping.tournament.useMutation();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const getResults = useCallback(
    async (search: string) => {
      const newResults = await fetchResults({
        search,
      });

      if (newResults) {
        setResults(newResults);
      }

      setQuery(search);
    },
    [fetchResults]
  );

  useEffect(() => {
    getResults(debouncedQuery);
  }, [debouncedQuery, getResults]);

  const filteredResults = useMemo(
    () =>
      debouncedQuery === ""
        ? results
        : results.filter((result) =>
            result.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(debouncedQuery.toLowerCase().replace(/\s+/g, ""))
          ),
    [debouncedQuery, results]
  );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative mt-1 w-full">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 dark:bg-slate-800 focus:ring-0 focus:outline-none"
            displayValue={({ name }: any) => name}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Search for a tournamnet"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <LuChevronsUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredResults.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                {query === ""
                  ? "Type a tournament name."
                  : "Keep typing the name."}
              </div>
            ) : (
              filteredResults.map((result) => (
                <Combobox.Option
                  key={result.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 text-black dark:text-white ${
                      active ? "bg-blue-200 dark:bg-blue-600" : "text-gray-900"
                    }`
                  }
                  value={result}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {new Date(result.date).getFullYear()}: {result.name}
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
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
