import React, { Fragment, useState, useEffect } from "react";
import { Button, Group, Card, Label } from "@shared/components";
import { Event } from "@shared/database";
import { useRouter } from "next/router";
import { trpc } from "@src/utils/trpc";
import { BiRadar } from "react-icons/bi";
import TournamentCombobox from "./TournamentCombobox";
import {
  ScrapingOption,
  TournamentSearchResult,
} from "@src/server/routers/scraping";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck } from "react-icons/hi";
import { LuChevronsUpDown } from "react-icons/lu";

interface FieldSelectProps {
  tournId: number | undefined;
  selected: ScrapingOption | undefined;
  setSelected(pool: ScrapingOption | undefined): void;
}

const JudgePoolSelect = ({
  tournId,
  selected,
  setSelected,
}: FieldSelectProps) => {
  const { mutateAsync: getResults } = trpc.scraping.judges.useMutation();
  const [data, setData] = useState<ScrapingOption[]>([]);

  useEffect(() => {
    if (tournId) {
      getResults({ id: tournId }).then((results) => {
        if (results) {
          setData(results);
          setSelected(results[0]);
        } else {
          setData([]);
          setSelected(undefined);
        }
      });
    }
  }, [tournId, getResults, setData, setSelected]);

  return (
    <div>
      <Label className="text-xs flex" character="a">
        Judge Pool
      </Label>
      <Listbox
        disabled={!tournId}
        value={selected}
        defaultValue={data[0]}
        onChange={setSelected}
      >
        <div className="relative mt-[2px]">
          <Listbox.Button className="disabled:!opacity-60 relative w-full max-w-96 cursor-default h-8 rounded bg-white dark:bg-slate-800 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
            <span className="w-full flex justify-between first-letter:pointer-events-none absolute inset-y-0 right-0 items-center px-2">
              <span className="block truncate text-xs md:text-auto">
                {selected?.name || "Select a pool."}
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
                        {o.name}
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

const EntryFieldSelect = ({
  tournId,
  selected,
  setSelected,
}: FieldSelectProps) => {
  const { mutateAsync: getResults } = trpc.scraping.entries.useMutation();
  const [data, setData] = useState<ScrapingOption[]>([]);

  useEffect(() => {
    if (tournId) {
      getResults({ id: tournId }).then((results) => {
        if (results) {
          setData(results);
          setSelected(results[0]);
        } else {
          setData([]);
          setSelected(undefined);
        }
      });
    }
  }, [tournId, getResults, setData, setSelected]);

  return (
    <div>
      <Label className="text-xs flex" character="b">
        Entry Field
      </Label>
      <Listbox
        value={selected}
        defaultValue={data[0]}
        onChange={setSelected}
        disabled={!tournId}
      >
        <div className="relative mt-[2px] w-full">
          <Listbox.Button className="disabled:!opacity-60 relative w-full max-w-96 cursor-default h-8 rounded bg-white dark:bg-slate-800 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
            <span className="w-full flex justify-between first-letter:pointer-events-none absolute inset-y-0 right-0 items-center px-2">
              <span className="block truncate text-xs md:text-auto">
                {selected?.name || "Select a field."}
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
                        {o.name}
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

const Radar = () => {
  const router = useRouter();
  const [tournament, setTournament] = useState<
    TournamentSearchResult | undefined
  >();
  const [pool, setPool] = useState<ScrapingOption | undefined>();
  const [field, setField] = useState<ScrapingOption | undefined>();

  return (
    <Card
      icon={<BiRadar />}
      title="Radar"
      theme="text-red-400"
      className="min-w-full md:min-w-[300px] md:max-w-[800px] m-10 mx-auto bg-sky-100 dark:bg-black shadow-2xl shadow-red-400/50 p-2"
    >
      <form className="space-y-2 w-full">
        <Group
          character="1"
          legend="Select Tournament"
          className="grid place-items-center w-full mx-auto px-4 sm:px-8 sm:mx-auto md:px-4"
        >
          <TournamentCombobox
            selected={tournament}
            setSelected={setTournament}
          />
        </Group>
        <Group
          character="2"
          legend="Choose Event"
          className="grid sm:grid-cols-2 gap-2 sm:gap-4 w-full mx-auto px-4 sm:px-8 sm:mx-auto md:px-4"
        >
          <JudgePoolSelect
            tournId={tournament?.id}
            selected={pool}
            setSelected={setPool}
          />
          <EntryFieldSelect
            tournId={tournament?.id}
            selected={field}
            setSelected={setField}
          />
        </Group>
        <Group
          character="3"
          legend="Get your results"
          className="flex justify-center w-full"
        >
          <Button
            _type="primary"
            className="w-36 text-sm !mt-0"
            disabled={!tournament || !pool || !field}
            onClick={() =>
              router.push({
                pathname: "/radar/threats",
                query: {
                  tourn: tournament?.id,
                  event: field?.id,
                },
              })
            }
          >
            Threat Sheet
          </Button>
          <p className="px-1 pt-px text-red-400 border-red-400 border rounded-full !mt-0">
            OR
          </p>
          <Button
            _type="primary"
            className="w-36 text-sm !mt-0"
            disabled={!tournament || !pool || !field}
            onClick={() =>
              router.push({
                pathname: "/radar/strikes",
                query: {
                  tourn: tournament?.id,
                  pool: pool?.id,
                },
              })
            }
          >
            Strike Sheet
          </Button>
        </Group>
      </form>
    </Card>
  );
};

export default Radar;
