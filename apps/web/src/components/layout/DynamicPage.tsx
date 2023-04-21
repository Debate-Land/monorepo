import React from 'react'
import { PortableText } from '@src/lib/sanity'
import GetImage from '@src/utils/get-image';
import Image from 'next/image';
import { NextSeo } from 'next-seo';

const DynamicPage = ({ title, body, author, _type, description, ...props }: any) => {
  const isBlog = _type == 'blog';
  const AuthorImageProps = GetImage(author.image)!;

  return (
    <>
      <NextSeo
        title={`${title} — Debate Land ${isBlog && 'Blog'}`}
        description={description}
      />
      <article className="pt-8 min-h-screen mx-2">
        <div className="max-w-[700px] mx-auto rounded-lg grid place-items-center aspect-video bg-gradient-to-r from-sky-400 via-purple-500 to-red-400">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-white mb-4 text-3xl sm:text-4xl md:text-6xl text-center font-black">{title}</h1>
            {
              isBlog && <div className="flex justify-center items-center gap-3 w-full">
                <Image
                  src={AuthorImageProps.src}
                  // blurDataURL={AuthorImageProps.}
                  loader={AuthorImageProps.loader}
                  alt={author.name}
                  // placeholder="blur"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="text-gray-300">
                    {author.name}
                    {/* TODO: Go to /team page from here */}
                  </p>
                </div>
              </div>
            }
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
