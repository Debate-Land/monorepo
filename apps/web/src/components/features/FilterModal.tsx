import { Combobox, Dialog, Listbox, Tab, Transition } from '@headlessui/react'
import { Button, Group } from '@shared/components';
import { Topic, TopicTag } from '@shared/database';
import getEnumName from '@src/utils/get-enum-name';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { HiCheck } from 'react-icons/hi';
import { LuChevronsUpDown } from 'react-icons/lu';
import { omit } from 'lodash';

interface FilterModalProps {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  topics: (Topic & {
    tags: TopicTag[]
  })[];
}

const FilterModal = ({ isOpen, setIsOpen, topics }: FilterModalProps) => {
  const router = useRouter();
  const uniqueTopics = useMemo(() => {
    let newTopics: typeof topics = [];
    topics.forEach(t => {
      if (!newTopics.find(_t => _t.id === t.id)) {
        newTopics.push(t);
      }
    });
    return newTopics;
  }, [topics]);
  const tags = useMemo(() => {
    let newTags: TopicTag[] = [];
    uniqueTopics.forEach(t => {
      t.tags.forEach(tag => {
        if (!newTags.find(_tag => _tag.id === tag.id)) {
          newTags.push(tag);
        }
      })
    });
    return newTags;
  }, [uniqueTopics]);
  const [selectedTopics, setSelectedTopics] = useState<(Topic & { tags: TopicTag[] })[]>([]);
  const [selectedTags, setSelectedTags] = useState<TopicTag[]>([]);
  const [query, setQuery] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const filteredTopics = useMemo(() =>
    query === ''
      ? uniqueTopics
      : uniqueTopics
        .filter(({ resolution }) =>
          resolution.toLowerCase().includes(query.toLowerCase())
  ), [query, uniqueTopics]);
  const applyChanges = useCallback(() => {
    let newQueryParams;
    switch (tabIndex) {
      case 0:
        newQueryParams = { topics: selectedTopics.map(topic => topic.id).join(',') }
        break;
      case 1:
        newQueryParams = { topicTags: selectedTags.map(tag => tag.id).join(',') }
      default:
        break;
    };
    router.push({
      pathname: router.pathname,
      query: {
        ...omit(router.query, ['topics', 'topicTags']),
        ...newQueryParams
      }
    });
    setIsOpen(false);
  }, [tabIndex, selectedTopics, selectedTags]);

  useEffect(() => {
    setSelectedTopics(
      router.query.topics
        ? (router.query.topics as string)
          .split(',')
          .map(t => parseInt(t))
          .map(id => uniqueTopics.find(t => t.id === id)) as (Topic & { tags: TopicTag[] })[]
        : uniqueTopics
    );
    setSelectedTags(
      router.query.topicTags
        ? (router.query.topicTags as string)
          .split(',')
          .map(t => parseInt(t))
          .map(id => tags.find(t => t.id === id)) as TopicTag[]
        : tags
    );
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-coal bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md h-96 transform overflow-hidden rounded-lg bg-white dark:bg-coal p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl leading-6 text-luka-200 dark:text-blue-600"
                >
                  Filter results
                </Dialog.Title>
                <div className="flex flex-col justify-between h-full pb-4">
                  <Group legend='Topic' character='1' className="flex flex-col items-center space-y-3 w-full px-2 !mt-0">
                    <Tab.Group selectedIndex={tabIndex} onChange={(index) => setTabIndex(index)}>
                      <Tab.List className="flex w-full">
                        {
                          ["Resolution", "Type"].map(category => (
                            <Tab
                              key={category}
                              className={({ selected }) =>
                                clsx(
                                  'w-fit pr-2 py-1 border-b text-sm text-start leading-5',
                                  selected
                                    ? 'border-luka-200 dark:border-blue-600'
                                    : 'border-gray-300 dark:border-gray-400'
                                )
                              }
                            >
                              {category}
                            </Tab>
                          ))
                        }
                      </Tab.List>
                      <Tab.Panels className="w-full">
                        <Tab.Panel key="Resolution">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTopics.length}/{uniqueTopics.length} topics selected.</p>
                          {/* @ts-ignore */}
                          <Combobox value={selectedTopics} onChange={setSelectedTopics} multiple>
                            <div className="relative mt-1 !max-w-96">
                              <div className="relative w-full cursor-default overflow-hidden rounded text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                  className="w-full border-none h-8 py-2 pl-3 pr-10 text-sm leading-5 dark:bg-slate-800 focus:ring-0 focus:outline-none"
                                  onChange={(event) => {
                                    setQuery(event.target.value);
                                  }}
                                  placeholder="Search for a topic"
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
                                afterLeave={() => setQuery('')}
                              >
                                <Combobox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {
                                    filteredTopics.length === 0 && (
                                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        No topic history for '{query}'.
                                      </div>
                                    )
                                  }
                                  {
                                    filteredTopics.map((topic) => (
                                      <Combobox.Option
                                        key={topic.id}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 text-black dark:text-white ${
                                            active ? 'bg-blue-200 dark:bg-blue-600' : 'text-gray-900'
                                          }`
                                        }
                                        value={topic}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <span
                                              className={`block truncate text-xs ${
                                                selected ? 'font-medium' : 'font-normal'
                                              }`}
                                            >
                                              {query === '' ? topic.resolution : topic.resolution.substring(topic.resolution.toLowerCase().indexOf(query.toLowerCase()))}
                                            </span>
                                            {selected || selectedTopics.find(t => t.id === topic.id) ? (
                                              <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                  active ? 'text-teal-600 dark:text-teal-300' : 'text-teal-600'
                                                }`}
                                              >
                                                <HiCheck className="h-5 w-5" aria-hidden="true" />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Combobox.Option>
                                    ))
                                  }
                                </Combobox.Options>
                              </Transition>
                            </div>
                          </Combobox>
                        </Tab.Panel>
                        <Tab.Panel key="Topic Type">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTags.length}/{tags.length} topic types selected.</p>
                          <Listbox value={selectedTags} onChange={setSelectedTags} multiple>
                            <div className="relative mt-[2px]">
                              <Listbox.Button className="relative w-full max-w-96 cursor-default h-8 rounded bg-white dark:bg-slate-800 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
                                <span className="w-full flex justify-between first-letter:pointer-events-none absolute inset-y-0 right-0 items-center px-2">
                                  <span className="block truncate text-xs md:text-auto">{selectedTags.map(({ tag }) => getEnumName(tag)).join(', ')}</span>
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
                                  {tags.map(t => (
                                    <Listbox.Option
                                      key={t.id}
                                      value={t}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 text-black dark:text-white ${
                                          active ? 'bg-blue-200 dark:bg-blue-600' : 'text-gray-900'
                                        }`
                                      }
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected ? 'font-medium' : 'font-normal'
                                            }`}
                                          >
                                            {getEnumName(t.tag)}
                                          </span>
                                          {selected || selectedTags.find(_t => _t.id == t.id) ? (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active ? 'text-teal-600 dark:text-teal-300' : 'text-teal-600'
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
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </Group>
                  <Button
                    _type="primary"
                    className="mx-auto"
                    onClick={applyChanges}
                  >
                    Apply Changes
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default FilterModal;
