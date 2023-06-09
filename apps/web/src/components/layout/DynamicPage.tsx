import React from 'react'
import { PortableText } from '@src/lib/sanity'
import GetImage from '@src/utils/get-image';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { types } from '@shared/cms';
import { parseISO, format } from "date-fns";
import { useRouter } from 'next/router';
import formatISO from '@src/utils/format-iso';

export type DynamicPageProps = types.Page & {
  author: types.Author;
}

const DynamicPage = ({ title, body, author, pageType, description, publishedAt }: DynamicPageProps) => {
  const { asPath } = useRouter();

  const isBlog = pageType == 'blog-post';
  const AuthorImageProps = isBlog && author && author.image ? GetImage(author.image) : {};

  const SEO_TITLE = `${title} — Debate Land ${isBlog ? 'Blog' : ''}`;
  const SEO_DESCRIPTION = `${description} ${isBlog ? 'Exclusively on the Debate Land Blog.' : ''}`
  return (
    <>
      <NextSeo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        openGraph={{
          title: SEO_TITLE,
          description: SEO_DESCRIPTION,
          type: 'website',
          url: `https://debate.land${asPath}`,
          images: [{
            url: `https://debate.land/api/og?title=${title}${isBlog ? `&label=Blog&publishedAt=${publishedAt}` : ''}`
          }]
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
      />
      <article className="pt-8 pb-12 min-h-screen mx-2">
        <div className="relative max-w-[700px] mx-auto rounded-lg flex justify-center items-center aspect-video bg-gradient-to-r from-sky-400 via-purple-500 to-red-400">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-white mb-4 text-3xl sm:text-4xl md:text-6xl text-center font-black md:!leading-[4.5rem]">{title}</h1>
            {
              isBlog && <div className="flex justify-center items-center gap-3 w-full bg-gray-50/10 px-2 py-1 rounded-2xl max-w-fit">
                <Image
                  // @ts-ignore
                  src={AuthorImageProps.src}
                  // blurDataURL={AuthorImageProps.}
                  // @ts-ignore
                  loader={AuthorImageProps.loader}
                  alt={author.name}
                  // placeholder="blur"
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8 -mr-2"
                />
                <div>
                  <p className="text-gray-200">
                    {author.name}
                    {/* TODO: Go to /team page from here */}
                  </p>
                </div>
              </div>
            }
            <p className="text-white/50 absolute bottom-1 sm:bottom-3 md:bottom-5">
              {
                formatISO(publishedAt)
              }
            </p>
          </div>
        </div>
        <div className="max-w-[700px] mx-auto my-3 prose dark:prose-invert prose-base prose-headings:my-2 w-full">
          <p className="italic">{description}</p>
          {body && <PortableText value={body} />}
        </div>
      </article>
    </>
  )
};

export default DynamicPage;
