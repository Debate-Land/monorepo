/* eslint-disable @next/next/no-img-element */
import formatISO from '@src/utils/format-iso';
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const image = fetch(new URL('public/assets/img/logo_32.png', import.meta.url)).then(res => res.arrayBuffer());


export default async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageData = await image;

    return new ImageResponse(
      (
        <div
          tw="flex flex-col justify-center items-center h-full w-full"
          style={{
            backgroundImage: 'linear-gradient(to right, #38bdf8, #a855f7, #f87171)'
          }}
        >
          <h3 tw='text-white text-3xl bg-gray-50/10 p-1 rounded shadow-xl text-center flex items-center'>
            <img
              // @ts-ignore
              src={imageData}
              alt="Logo"
              tw="mr-1"
            />
            Debate Land
          </h3>
          <h1 tw='text-white text-6xl text-center -mt-2'>
            {searchParams.get('title')!}
          </h1>
          {
            searchParams.has('label') && (
              <span
                tw="bg-purple-400 px-3 text-white/80 text-xl rounded-2xl shadow-xl mt-2"
              >
                {searchParams.get('label')}
              </span>
            )
          }
          {
            searchParams.has('publishedAt') && <p tw="absolute bottom-0 text-white/80">{formatISO(searchParams.get('publishedAt')!)}</p>
          }
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}