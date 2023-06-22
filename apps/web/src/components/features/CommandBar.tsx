import { Button } from '@shared/components';
import React, { useState } from 'react'
import { AiOutlineFilter, AiOutlineMail } from 'react-icons/ai';
import { VscArrowSwap } from 'react-icons/vsc';
import EmailModal from '../email/email-modal';
import FilterModal, { FilterModalProps } from './FilterModal';
import { EmailInputProps } from '../email/email-input';

type ActiveModal = "Email" | "Filter" | null;

interface CommandBarProps {
  children: any
  topics: FilterModalProps['topics'];
  subscriptionName: string;
  emailProps: EmailInputProps;
}

const CommandBar = ({ children, topics, subscriptionName, emailProps }: CommandBarProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <>
      <FilterModal
        isOpen={activeModal == "Filter"}
        setIsOpen={(val) => setActiveModal(val ? "Filter" : null)}
        topics={topics}
      />
      <EmailModal
        isOpen={activeModal == "Email"}
        setIsOpen={(val) => setActiveModal(val ? "Filter" : null)}
        subscriptionName={subscriptionName}
        {...emailProps}
      />
      <div className="flex flex-col w-full items-center space-y-2">
        <p>{children}</p>
        <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 w-fit">
          <Button
            onClick={() => setActiveModal("Filter")}
            icon={<AiOutlineFilter className="!mr-1 text-indigo-100 group-hover:text-white group-hover:-rotate-12 group-active:rotate-0 group-active:scale-75 transition-all" />}
            _type="primary"
            className="w-24 h-5 bg-purple-200/20 backdrop-blur-2xl text-indigo-100 !mx-1 !text-xs !py-0 border border-indigo-300 group !rounded !bg-none hover:!bg-gradient-to-r hover:border-none"
          >
            Filter
          </Button>
          <Button
            onClick={() => setActiveModal("Email")}
            icon={<AiOutlineMail className="!mr-1 text-indigo-100 group-hover:text-white group-hover:-rotate-12 group-active:rotate-0 group-active:scale-75 transition-all" />}
            _type="primary"
            className="w-24 h-5 bg-purple-200/20 backdrop-blur-2xl text-indigo-100 !mx-1 !text-xs !py-0 border border-indigo-300 group !rounded !bg-none hover:!bg-gradient-to-r hover:border-none"
          >
            Updates
          </Button>
        </div>
      </div>
    </>
  )
}

export default CommandBar