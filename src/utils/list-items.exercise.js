import {useQuery, queryCache, useMutation} from 'react-query'
import {client} from './api-client.exercise'

export const useListItems = ({user}) => {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
  })
  return listItems ?? []
}

export const useListItem = ({user, bookId}) => {
  const listItems = useListItems({user})
  return listItems?.find(li => li.id === bookId) ?? null
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

export const useUpdateListItem = ({user}) => {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        token: user.token,
        method: 'PUT',
        data: updates,
      }),
    defaultMutationOptions,
  )
}

export const useRemoveListItem = ({user}) => {
  return useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        token: user.token,
        method: 'DELETE',
      }),
    defaultMutationOptions,
  )
}
