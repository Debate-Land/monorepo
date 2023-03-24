import getApiRequest from '../lib/api-request'
import { useQuery } from 'react-query'
import { getTeamQuery } from '../const/queries'

const useTeamHistory = (id: string) => {
  const { data, isLoading, error } = useQuery(['entry'], async () =>
    getApiRequest('teams/advanced/findUnique', getTeamQuery(id)),
  )

  return {
    history: data,
    isLoading,
    error,
  }
}

export default useTeamHistory
