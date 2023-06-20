import { Dialog, Transition } from '@headlessui/react'
import { types } from '@shared/cms';
import { Fragment, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts';
import { PortableText } from '@src/lib/sanity';
import { Button } from '@shared/components';
import { CloseIcon } from '@sanity/icons';

interface FeatureModalProps {
  changelog: types.ChangelogPopup
}

const FeatureModal = ({ changelog }: FeatureModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previousPopupPublishedAt, setPreviousPopupPublishedAt] = useLocalStorage<null | string>('feature_popup', null);

  useEffect(() => {
    if (!previousPopupPublishedAt || previousPopupPublishedAt !== changelog.publishedAt) {
      setIsOpen(true);
      setPreviousPopupPublishedAt(changelog.publishedAt)
    }
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
        <div className="fixed inset-0">
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
              <Dialog.Panel className="relative overflow-y-scroll w-full max-w-[700px] max-h-[500px] transform overflow-hidden rounded-lg bg-white dark:bg-coal p-6 text-left align-middle shadow-xl transition-all">
                <button
                  className="absolute right-4 top-4 hover:opacity-50 active:opacity-80 focus:outline-none focus:ring-0"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon fontSize={20} />
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-xl leading-6 text-violet-400 dark:text-violet-300"
                >
                  <strong>{changelog.heading}</strong>
                </Dialog.Title>
                <div className="inset-4 overflow-y-scroll h-96 mx-auto py-2">
                  <div className="prose dark:prose-invert prose-base prose-headings:my-2">
                    <PortableText value={changelog.body} />
                  </div>
                </div>
                <Button
                  _type="primary"
                  className="mx-auto mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default FeatureModal;
