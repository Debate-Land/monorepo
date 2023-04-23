import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const image = fetch(new URL('public/assets/img/logo_32.png', import.meta.url)).then(res => res.arrayBuffer());

function formatISO(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}


export default async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageData = await image;
    const isBlog = false;

    return new ImageResponse(
      (
        <div
          tw="flex flex-col justify-center items-center h-full w-full"
          style={{
            backgroundImage: 'linear-gradient(to right, #38bdf8, #a855f7, #f87171)'
          }}
        >
          <span
            tw="bg-purple-400 px-2 text-white/80 rounded-xl"
          >
            {searchParams.get('label')}
          </span>
          <h1 tw='text-white text-6xl text-center'>
            {searchParams.get('title')!}
          </h1>
          <h1 tw='text-white text-xl bg-gray-50/10 px-1 rounded shadow-xl text-center'>
            exclusively on Debate Land
          </h1>
          <img
            src={imageData} />
          <p tw="absolute bottom-0 text-white/80">{formatISO(searchParams.get('publishedAt')!)}</p>
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