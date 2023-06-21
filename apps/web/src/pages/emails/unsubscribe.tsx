import { trpc } from '@src/utils/trpc';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Unsubscribe = () => {
  const { query, isReady } = useRouter();
  const { mutateAsync: unsubscribe, isLoading, isIdle, isError } = trpc.email.unsubscribe.useMutation();

  useEffect(() => {
    if (query.email && query.type) {
      unsubscribe({
        email: query.email as string,
        ...(query.type === "judge" && {
          judgeId: query.id as string
        }),
        ...(query.type === "team" && {
          teamId: query.id as string
        })
      })
    }
  }, [isReady, query.email, query.id, query.type, unsubscribe])

  return (
    <div className="grid place-items-center w-full h-screen">
      {
        isLoading && (
          <h1 className="text-xl">Unsubscribing...</h1>
        )
      }
      {
        (isIdle && isReady && (!query.email || !query.type)) || (isError) && (
          <h1 className="text-xl text-red-400">
            Error Unsubscribing. Please contact <a className="text-blue-400 underline" href="mailto:support@debate.land">support</a>.
          </h1>
        )
      }
      {
        isReady && !isError && !isLoading && query.email && query.type && (
          <h1 className="text-xl text-green-500">Unsubscribed Successfully.</h1>
        )
      }
    </div>
  )
}

export default Unsubscribe