import clsx from 'clsx'
import React from 'react'
import Text from './Text'

export interface LinkProps {
  href: string
  text?: string
  external?: boolean
  primary?: boolean
  document?: boolean
  icon?: JSX.Element
  [key: string]: any
}

const Link = ({ href, text, size, external, primary, document, wrapperClassName, className, icon, ...props }: LinkProps) => (
  // eslint-disable-next-line react/jsx-no-target-blank, react/jsx-props-no-spreading
  <a href={href} target={external ? '_blank' : ''} className={wrapperClassName} {...props}>
    <Text
      size={size}
      className={clsx(
        'cursor-pointer font-bold transition-all flex items-center',
        {
          'text-indigo-400 hover:text-inherit': !primary && !document,
          'text-indigo-400 hover:text-violet-300': primary,
          'text-white hover:text-violet-300 hover:underline decoration-dotted transition-all ': document,
        },
        className,
      )}
    >
      {
        icon && (
          <>
            {icon}
            <span className="mr-1" />
          </>
        )
      }
      {text || props.children}
    </Text>
  </a>
)

export default Link
