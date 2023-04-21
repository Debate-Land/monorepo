import client, { PortableText, getClient } from '@src/lib/sanity'
import GetImage from '@src/utils/get-image';
import React from 'react'
import Image from 'next/image';

const Page = ({title, body, author}: any) => {
  const AuthorImageProps = GetImage(author.image)!;

  return (
    <article className="pt-8 min-h-screen">
      <div className="max-w-[700px] mx-auto rounded-lg grid place-items-center aspect-video bg-gradient-to-r from-sky-400 via-purple-500 to-red-400">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white mb-4 text-3xl sm:text-4xl md:text-6xl text-center font-black">{title}</h1>
          <div className="flex justify-center items-center gap-3 w-full">
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
        </div>
      </div>
      <div className="max-w-[700px] mx-auto my-3 prose dark:prose-invert prose-base prose-headings:my-2 w-full">
        {body && <PortableText value={body} />}
      </div>
    </article>
  )
}

export const getStaticPaths = async () => {
  const pages = await client.fetch < { slug: { current: string } }[] >(`*[_type=='page']`);
  return {
    paths: pages?.map(page => ({
      params: {
        slug: page.slug.current
      }
    })) || [{
      params: {
        slug: 'debate-land-blog'
      }
    }],
    fallback: true
  }
}

interface StaticProps {
  params: {
    slug: string;
  },
  preview?: boolean;
}

export const getStaticProps = async ({ params, preview = false }: StaticProps) => {
  const page = await getClient(preview).fetch(`*[_type=='page' && slug.current=='${params.slug}'] {
    ...,
    author->
  }`);

  return {
    props: {
      ...page[0]
    }
  }
}

export default Page