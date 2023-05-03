/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import debounceFn from 'debounce-fn'
import {FaRegCalendarAlt} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import {useParams} from 'react-router-dom'
import {useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import {formatDate} from 'utils/misc'
import * as mq from 'styles/media-queries'
import * as colors from 'styles/colors'
import {Textarea} from 'components/lib'
import {Rating} from 'components/rating'
import {StatusButtons} from 'components/status-buttons'
import {useBook} from 'utils/books.exercise'
import { useListItems } from 'utils/list-items.exercise'

function BookScreen({user}) {
  const {bookId} = useParams()
  const book = useBook({bookId, user})

  const listItems = useListItems({user})
  const listItem = listItems?.find(li => li.bookId === bookId) ?? null

  const {title, author, coverImageUrl, publisher, synopsis} = book

  return (
    <div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gridGap: '2em',
          marginBottom: '1em',
          [mq.small]: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <img
          src={coverImageUrl}
          alt={`${title} book cover`}
          css={{width: '100%', maxWidth: '14rem'}}
        />
        <div>
          <div css={{display: 'flex', position: 'relative'}}>
            <div css={{flex: 1, justifyContent: 'space-between'}}>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span css={{marginRight: 6, marginLeft: 6}}>|</span>
                <i>{publisher}</i>
              </div>
            </div>
            <div
              css={{
                right: 0,
                color: colors.gray80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minHeight: 100,
              }}
            >
              {book.loadingBook ? null : (
                <StatusButtons user={user} book={book} />
              )}
            </div>
          </div>
          <div css={{marginTop: 10, height: 46}}>
            {listItem?.finishDate ? (
              <Rating user={user} listItem={listItem} />
            ) : null}
            {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {!book.loadingBook && listItem ? (
        <NotesTextarea user={user} listItem={listItem} />
      ) : null}
    </div>
  )
}

function ListItemTimeframe({listItem}) {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date'

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{marginTop: 6}}>
        <FaRegCalendarAlt css={{marginTop: -2, marginRight: 5}} />
        <span>
          {formatDate(listItem.startDate)}{' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  )
}

function NotesTextarea({listItem, user}) {
  // 🐨 call useMutation here
  // the mutate function should call the list-items/:listItemId endpoint with a PUT
  //   and the updates as data. The mutate function will be called with the updates
  //   you can pass as data.
  // 💰 if you want to get the list-items cache updated after this query finishes
  // then use the `onSettled` config option to queryCache.invalidateQueries('list-items')
  const [update] = useMutation(
    updates =>
      client(`list-items/${listItem.id}`, {
        token: user.token,
        method: 'PUT',
        data: updates,
      }),
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
    },
  )
  // 💣 DELETE THIS ESLINT IGNORE!! Don't ignore the exhaustive deps rule please
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedMutate = React.useMemo(
    () => debounceFn(update, {wait: 300}),
    [update],
  )

  function handleNotesChange(e) {
    debouncedMutate({id: listItem.id, notes: e.target.value})
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  )
}

export {BookScreen}
