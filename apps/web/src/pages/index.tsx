import React from "react";
import { Text } from "@shared/components";
import { trpc } from '@src/utils/trpc';

export default function Home() {
  const hello = trpc.hello.useQuery({ text: 'client' });

  return (
    <div className='h-screen flex flex-col items-center justify-center '>
      <Text size="xl">{hello.data?.greeting}</Text>
    </div>
  )
}
