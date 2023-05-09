import { DynamicPageProps } from '@src/components/layout';
import { getClient } from '@src/lib/sanity';
import React from 'react';
import { useRouter } from 'next/router';
import Overview from '@src/components/layout/Overview';
import { NextSeo } from 'next-seo';
import { PostCard } from '@src/components/blog';

interface Props {
  pages: DynamicPageProps[]
}

const Index = ({ pages }: Props) => {
  const router = useRouter();

  const SEO_TITLE = "The Forensic Files — Debate Land";
  const SEO_DESCRIPTION = "Debate Land's blog featuring case studies, research, and insights for all things debate."
  const OG_TITLE = "The Forensic Files";
  const OG_LABEL = "Blog";
  return (
    <>
      <NextSeo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        openGraph={{
          title: SEO_TITLE,
          description: SEO_DESCRIPTION,
          type: 'website',
          url: `https://debate.land`,
          images: [{
            url: `https://debate.land/api/og?title=${OG_TITLE}&label=${OG_LABEL}`
          }]
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
      />
      <div className="min-h-screen">
        <Overview
          label="Blog"
          heading="The Forensics Files"
          subtitle="Case Studies | Research | Insights"
          underview={
            <div className='py-3 uppercase' style={{letterSpacing: '0.1em'}}>
              <p className="bg-gradient-to-r from-sky-400 via-purple-500 to-red-400 text-transparent bg-clip-text text-center">Thoughts from the creators of Debate Land</p>
            </div>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 mt-12 p-2 gap-3 max-w-[700px] mx-auto">
          {
            pages.map(page => <PostCard key={page._id} router={router} {...page} />)
          }
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const pages = await getClient(false).fetch<DynamicPageProps[]>(`*[_type=='page' && pageType == 'blog-post'] {
    ...,
    author->
  }`);

  return {
    props: {
      pages
    },
  }
}

export default Index;
