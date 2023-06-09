import {useQuery, queryCache} from 'react-query'
import {client} from './api-client.exercise'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchConfig = ({query, user}) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then(data => data.books),
  config: {
    onSuccess(books) {
      for (let book of books) {
        setQueryDataForBook(book)
      }
    },
  },
})

export const useBook = ({bookId, user}) => {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })
  return data ?? loadingBook
}

export const useBookSearch = ({query, user}) => {
  const {data: books = loadingBooks, ...rest} = useQuery(
    getBookSearchConfig({query, user}),
  )
  return {books, ...rest}
}

export const refetchBookSearchQuery = ({user}) => {
  queryCache.removeQueries('bookSearch')
  queryCache.prefetchQuery(getBookSearchConfig({query: '', user}))
}

export const setQueryDataForBook = book => {
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}
