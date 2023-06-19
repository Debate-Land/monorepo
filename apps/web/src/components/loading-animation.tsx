import { Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react'
import TextTransition, { presets } from 'react-text-transition'

const PHRASES = [
  "Fetching data...",
  "Computing scores...",
  "Building tables...",
  "Getting ready..."
];

const transitionClasses = {
  enter: 'ease-out duration-300',
  enterFrom: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
  enterTo: 'opacity-100 translate-y-0 sm:scale-100',
  leave: 'ease-in duration-200',
  leaveFrom: 'opacity-100 translate-y-0 sm:scale-100',
  leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
};

interface LoadingAnimationProps {
  visible: boolean;
}

const LoadingAnimation = ({ visible }: LoadingAnimationProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex(index + 1),
      1500
    );
    return () => clearTimeout(intervalId);
  });

  return (
    <Transition
      show={visible}
      className="z-50 w-full h-full fixed grid place-items-center place-content-center"
      {...transitionClasses}
    >
      <div className="w-52 flex justify-center bg-gradient-to-r backdrop-blur-sm from-sky-400/70 via-purple-500/70 to-red-400/70 px-2 py-3 rounded-lg">
        <h3>
          <TextTransition springConfig={presets.stiff} className="animate-pulse">
            {PHRASES[index % PHRASES.length]}
          </TextTransition>
        </h3>
      </div>
    </Transition>
  )
}

export default LoadingAnimation