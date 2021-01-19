import React from 'react'
import { gql, useMutation } from '@apollo/client'
import AddBook from './AddBook.jsx'
import AddAuthor from './AddAuthor.jsx'
import ShowAuthors from './ShowAuthors.jsx'
import { GET_BOOKS } from './../App.js'
import { GET_AUTHORS } from './ShowAuthors.jsx'

const DELETE_BOOK = gql`
  mutation delete_book($id: ID!) {
    delete_book(id: $id) {
      book {
        id,
        title,
        pages,
      }
      success
    }
  }
`;

const Books = ({books}) => {

  const [deleteBook] = useMutation(DELETE_BOOK)

  const handleDelete = (id) => {
    deleteBook({
      variables: {
        id
      },
        update(cache, { data: { deleteBook } }) {
          try {
            const data = cache.readQuery({ query: GET_BOOKS })
            const filteredBookList = data.books.filter(book => {
              return book.id !== id
            })
            const bookToDelete = data.books.find(book => {
              return book.id === id
            })

            // Remove book from cache's list of books with
            cache.writeQuery({
              query: GET_BOOKS,
              data: {
                books: filteredBookList
              }
            })
            // Remove book from its author's book list in cache
            cache.modify({
              id: cache.identify(bookToDelete.author),
              fields: {
                books(existingBookRefs, { readField }) {
                  return existingBookRefs.filter(bookRef => {
                    return readField('id', bookRef) != bookToDelete.id
                  })
                }
              }
            })
            // Run cache's garbage collection
            return cache.gc()
          } catch(e) {
            console.log(`Error: ${e}`);
          }
      }
    })
  }

  const renderBooks = () => {
    return books.map((book, index) => {
      return (
        <div className='book' key={book.id}>
          <div className='title'>{book.title}</div>
          <div className='author'>{`By: ${book && book.author.last_name}`}</div>
          <div
            className='button'
            onClick={()=>{handleDelete(book.id)}}>
            {`Delete`}
          </div>
        </div>
      )
    })
  }

  return renderBooks()
}

const Main = ({ page, books }) => {

  const renderMain = () => {
    if (page === 'show-books') {
      return (
        <>
          <div className='book-container-title'>{`~Books~`}</div>
          <div className='book-container'>
            <Books books={books} />
          </div>
        </>
      )
    } else if (page === 'add-book') {
      return <AddBook books={books} />
    } else if (page === 'show-authors') {
      return (
        <>
          <div className='author-container-title'>{`~Authors~`}</div>
          <div className='author-container'>
            <ShowAuthors />
          </div>
        </>
        )
    } else if (page === 'add-author') {
      return <AddAuthor />
    }
  }

  return (
    <div className='main-container'>
      {renderMain()}
    </div>
  )
}

export default Main
