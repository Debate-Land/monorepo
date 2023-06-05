import { DynamicPageProps } from '@src/components/layout';
import React from 'react';
import Image from 'next/image';
import GetImage from '@src/utils/get-image';
import { NextRouter, useRouter } from 'next/router';
import formatISO from '@src/utils/format-iso';

interface PostCardProps extends DynamicPageProps {
  router: NextRouter;
}

const PostCard = ({ slug, title, author, publishedAt, router }: PostCardProps) => {
  const AuthorImageProps = GetImage(author.image)!;

  return (
    <div
      className="flex group flex-col p-[2px] rounded-lg bg-gradient-to-r from-sky-400 via-purple-500 to-red-400 cursor-pointer"
      onClick={() => router.push(`/blog/${slug.current}`)}
    >
      <div className="bg-white dark:bg-coal hover:bg-transparent dark:hover:bg-transparent w-full h-full p-3 rounded-md flex flex-col justify-between">
        <h1 className="text-xl group-hover:text-white">{title}</h1>
        <div className='w-full border-t border-dashed border-gray-600 dark:border-gray-400 group-hover:border-0 flex items-center space-x-2 pt-3 mt-3'>
          <Image
              src={AuthorImageProps.src}
              // blurDataURL={AuthorImageProps.}
              loader={AuthorImageProps.loader}
              alt={author.name}
              // placeholder="blur"
              width={32}
              height={32}
              className="rounded-full w-8 h-8"
          />
          <div>
            <p className="text-red-400 group-hover:text-white">{author.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-200">
              { formatISO(publishedAt) }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard;
