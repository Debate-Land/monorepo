/* eslint-disable @next/next/no-html-link-for-pages */
import React, { Fragment } from 'react'
import EmailInput, { EmailInputProps } from './email-input'
import { Transition } from '@headlessui/react';
import { Dialog } from '@headlessui/react';
import { CloseIcon } from '@sanity/icons';

export interface EmailModalProps extends EmailInputProps {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  subscriptionName: string
}

const EmailModal = ({ isOpen, setIsOpen, subscriptionName, ...props}: EmailModalProps) => {
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
              <Dialog.Panel className="relative w-full max-w-md h-26 transform overflow-hidden rounded-lg bg-white dark:bg-coal p-6 text-left align-middle shadow-xl transition-all">
                <button
                  className="absolute right-5 top-6 hover:opacity-50 active:opacity-80 focus:outline-none focus:ring-0"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon fontSize={20} />
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-xl mb-2 leading-6 text-violet-400 dark:text-violet-300"
                >
                  Subscribe {`to ${subscriptionName}`}
                </Dialog.Title>
                <EmailInput {...props} />
                <p className="text-xs mt-2 text-blue-400">
                  <a href="/terms-of-service" className="underline">
                    Terms
                  </a>
                  {' & '}
                  <a href="/privacy-policy" className="underline">
                    Privacy
                  </a>
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
};

export default EmailModal;
