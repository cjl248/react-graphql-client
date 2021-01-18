import React from 'react'
import { gql, useMutation } from '@apollo/client'
import AddBook from './AddBook.jsx'
import { GET_BOOKS } from './../App.js'

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
        const data = cache.readQuery({ query: GET_BOOKS })
        const filteredBookList = data.books.filter(book => {
          return book.id !== id
        })
        return cache.writeQuery({
          query: GET_BOOKS,
          data: {
            books: filteredBookList,
          }
        })
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
          <div className='book-container-title'>{`~Recommendations~`}</div>
          <div className='book-container'>
            <Books books={books} />
          </div>
        </>
      )
    } else if (page === 'add-book') {
      return <AddBook books={books} />
    }
  }

  return (
    <div className='main-container'>
      {renderMain()}
    </div>
  )
}

export default Main
