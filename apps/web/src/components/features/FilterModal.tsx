import { Dialog, Listbox, Transition } from '@headlessui/react'
import { Button } from '@shared/components';
import { Topic, TopicTag } from '@shared/database';
import { Fragment, useMemo, useState } from 'react'
import { HiCheck } from 'react-icons/hi';
import { LuChevronsUpDown } from 'react-icons/lu';

interface FilterModalProps {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  topics: (Topic & {
    tags: TopicTag[]
  })[];
}

const FilterModal = ({ isOpen, setIsOpen, topics }: FilterModalProps) => {
  const uniqueTopics = useMemo(() => {
    let newTopics: typeof topics = [];
    topics.forEach(t => {
      if (!newTopics.find(_t => _t.id === t.id)) {
        newTopics.push(t);
      }
    });
    return newTopics;
  }, [topics]);
  console.log(uniqueTopics)
  const [selectedTopics, setSelectedTopics] = useState(uniqueTopics);

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
                  className="text-lg font-medium leading-6 text-luka-200 dark:text-blue-600"
                >
                  Filter results
                </Dialog.Title>
                <div className="flex flex-col space-y-4">
                  <Listbox value={selectedTopics} onChange={setSelectedTopics} multiple>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-96 cursor-default h-8 rounded bg-white dark:bg-slate-800 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
                        <span className="w-full flex justify-between first-letter:pointer-events-none absolute inset-y-0 right-0 items-center px-2">
                          <span className="block truncate">{selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''} selected.</span>
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
                        <Listbox.Options className="z-40 absolute max-h-60 w-96 overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {uniqueTopics.map(t => (
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
                                    {t.resolution}
                                  </span>
                                  {selected ? (
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
                  <Button
                    _type="primary"
                    className="mx-auto"
                    onClick={() => setIsOpen(false)}
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
