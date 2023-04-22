import Head from 'next/head';
import { NextStudio } from 'next-sanity/studio';
import { NextStudioHead } from 'next-sanity/studio/head';
import config from '../lib/sanity.config';
import React from 'react';

const Index = () => {
  return (
    <>
      <Head>
        <NextStudioHead />
      </Head>
      <NextStudio config={config} />
    </>
  )
}

export default Index;