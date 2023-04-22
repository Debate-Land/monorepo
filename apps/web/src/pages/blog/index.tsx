import { Card } from '@shared/components';
import { DynamicPageProps } from '@src/components/layout';
import { getClient } from '@src/lib/sanity';
import React from 'react';
import Image from 'next/image';
import { IoNewspaperOutline } from 'react-icons/io5';
import GetImage from '@src/utils/get-image';
import { parseISO, format } from "date-fns";
import { NextRouter, useRouter } from 'next/router';

interface PostCardProps extends DynamicPageProps {
  router: NextRouter;
}

const PostCard = ({ slug, title, author, publishedAt, router }: PostCardProps) => {
  const AuthorImageProps = GetImage(author.image)!;

  return (
    <div
      className="flex flex-col p-1 rounded-lg bg-gradient-to-r from-sky-400 via-purple-500 to-red-400"
      onClick={() => router.push(`/blog/${slug.current}`)}
    >
      <div className="bg-white dark:bg-coal hover:bg-transparent w-full h-full p-3 rounded-md">
        <h1 className="text-xl">{title}</h1>
        <div className='w-full border-t border-dashed border-gray-600 dark:border-gray-400 flex items-center space-x-2 pt-3 mt-3'>
          <Image
              src={AuthorImageProps.src}
              // blurDataURL={AuthorImageProps.}
              loader={AuthorImageProps.loader}
              alt={author.name}
              // placeholder="blur"
              width={32}
              height={32}
              className="rounded-full w-32 h-32"
          />
          <div>
            <p className="text-red-400">{author.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{
              format(
                parseISO(publishedAt),
                "MMMM dd, yyyy"
              )
            }</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  pages: DynamicPageProps[]
}

const Index = ({ pages }: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full max-w-[700px] mx-auto px-2 min-h-screen pt-8">
      <Card
        title="Blog"
        icon={<IoNewspaperOutline />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 p-2">
          {
            pages.map(page => <PostCard key={page._id} router={router} {...page} />)
          }
        </div>
      </Card>

    </div>
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
