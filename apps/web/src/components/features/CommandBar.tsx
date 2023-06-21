import { Button } from '@shared/components';
import React, { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai';
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
      <div className="flex flex-col w-full items-center space-y-1">
        <p>{children}</p>
        <div className="flex w-fit">
          <Button
            onClick={() => setActiveModal("Filter")}
            icon={<VscArrowSwap className="text-gray-300 hover:text-white hover:-rotate-12 active:rotate-0 active:scale-75 transition-all" />}
            _type="primary"
            className="w-5 lg:w-6 h-5 lg:h-6 !mx-1 !p-0 border border-gray-300 group !rounded !bg-none hover:!bg-gradient-to-r hover:border-none"
            customIcon
          />
          <Button
            onClick={() => setActiveModal("Email")}
            icon={<AiOutlineMail className="text-gray-300 hover:text-white hover:-rotate-12 active:rotate-0 active:scale-75 transition-all" />}
            _type="primary"
            className="w-5 lg:w-6 h-5 lg:h-6 !mx-1 !p-0 border border-gray-300 group !rounded !bg-none hover:!bg-gradient-to-r hover:border-none"
            customIcon
          />
        </div>
      </div>
    </>
  )
}

export default CommandBar