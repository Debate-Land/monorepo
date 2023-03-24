/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import clsx from 'clsx'
import { withRouter } from 'next/router'
import Header from '../Header'
import Footer from '../Footer'

const Page = ({ children, className, router, ...props }: any) => {
  return (
    <div
      className={clsx('flex flex-col w-full min-h-screen scroll-smooth', className, {
        'dark:bg-stone-900': router.pathname !== '/',
      })}
      {...props}
    >
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default withRouter(Page)
