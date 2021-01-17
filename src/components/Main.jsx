import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import AddBook from './AddBook.jsx'

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
      update: cache => {
        const data = cache.writeQuery({query: DELETE_BOOK})
      },
      variables: {id: id}
    })
  }

  const renderBooks = () => {
    return books.map((book, index) => {
      return (
        <div className='book' key={book.id}>
          <div className='title'>{book.title}</div>
          <div className='author'>{`By: ${book.author.last_name}`}</div>
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

  const [bookList, setBookList] = React.useState(books)

  const renderMain = () => {
    if (page === 'show-books') {
      return (
        <>
          <div className='book-container-title'>{`~Books~`}</div>
          <div className='book-container'>
            <Books books={bookList} />
          </div>
        </>
      )
    } else if (page === 'add-book') {
      return <AddBook books={bookList} setBookList={setBookList} />
    }
  }

  return (
    <div className='main-container'>
      {renderMain()}
    </div>
  )
}

export default Main
