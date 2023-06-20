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
            icon={<VscArrowSwap className="text-white text-lg" />}
            _type="primary"
            className="w-6 h-6 !mx-1 !p-0 !rounded"
          />
          <Button
            onClick={() => setActiveModal("Email")}
            icon={<AiOutlineMail className="text-white text-lg" />}
            _type="primary"
            className="w-6 h-6 !mx-1 !p-0 !rounded"
            />
        </div>
      </div>
    </>
  )
}

export default CommandBar