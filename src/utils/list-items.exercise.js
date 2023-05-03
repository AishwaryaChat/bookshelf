import {useQuery, queryCache, useMutation} from 'react-query'
import {client} from './api-client.exercise'
import {setQueryDataForBook} from './books.exercise'

export const useListItems = ({user}) => {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    config: {
      onSuccess(listItems) {
        for (let item of listItems) {
          setQueryDataForBook(item.book)
        }
      },
    },
  })
  return listItems ?? []
}

export const useListItem = ({user, bookId}) => {
  const listItems = useListItems({user})
  const listItem = listItems?.find(li => li.bookId === bookId) ?? null
  return listItem
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

export const useUpdateListItem = ({user, options}) => {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        token: user.token,
        method: 'PUT',
        data: updates,
      }),
    {...defaultMutationOptions, ...options},
  )
}

export const useRemoveListItem = ({user, options}) => {
  return useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        token: user.token,
        method: 'DELETE',
      }),
    {...defaultMutationOptions, ...options},
  )
}

export const useCreateListItem = ({user, options}) =>
  useMutation(
    ({bookId}) =>
      client(`list-items`, {
        token: user.token,
        method: 'POST',
        data: {bookId},
      }),
    {...defaultMutationOptions, ...options},
  )
