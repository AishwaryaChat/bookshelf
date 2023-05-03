import { useQuery } from "react-query"
import { client } from "./api-client.exercise"
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
    title: 'Loading...',
    author: 'loading...',
    coverImageUrl: bookPlaceholderSvg,
    publisher: 'Loading Publishing',
    synopsis: 'Loading...',
    loadingBook: true,
  }

export const useBook = ({bookId, user}) => {
    const {data} = useQuery({
        queryKey: ['book', {bookId}],
        queryFn: () => client(`books/${bookId}`, {token: user.token}).then(data => data.book)
    })
    return data ?? loadingBook
}