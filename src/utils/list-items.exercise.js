import {useQuery} from 'react-query'
import {client} from './api-client.exercise'

export const useListItems = ({user}) => {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
  })
  return listItems
}

export const useListItem = ({user, bookId}) => {
  const listItems = useListItems({user})
  return listItems?.find(li => li.id === bookId) ?? null
}
