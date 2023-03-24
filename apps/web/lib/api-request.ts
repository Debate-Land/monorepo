import API_BASE from '../const/api-base'

const getApiRequest = (endpoint: string, query: object) =>
  fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(query),
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())

export default getApiRequest
