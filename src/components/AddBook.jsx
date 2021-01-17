import React from 'react'
import { gql, useMutation, refetchQueries } from '@apollo/client'

const ADD_BOOK = gql`
  mutation add_book($title: String!, $pages: Int!, $author_id: Int!) {
    add_book(title: $title, pages: $pages, author_id: $author_id) {
      book {
        id,
        title,
        pages,
        author {
          last_name
        }
      }
    }
  }
`;

const GET_BOOKS = gql`
  {
    books {
      id,
      title,
      pages
      author {
        id,
        last_name
      }
    }
  }
`;

export default function AddBook({books, setBookList}) {

  const [title, setTitle] = React.useState('')
  const [author, setAuthor] = React.useState('')
  const [pages, setPages] = React.useState('')

  const [addBook, { mutate, data, error }] = useMutation(ADD_BOOK)

  const handleAddBook = () => {
    setTitle('')
    setAuthor('')
    setPages('')
    addBook({
      variables: {
        title: title,
        pages: pages,
        author_id: author,
      },
      options: {
        awaitRefetchQueries: true
      }
    }, {
      refetchQueries: [
        {query: GET_BOOKS}
      ]
    })
  }

  return (
    <div className='add-book-container'>
      <div>
        <div>{`Title: `}</div>
        <input
          type='text-field'
          value={title}
          onChange={(e)=>{setTitle(e.target.value)}}>
        </input>
      </div>
      <div>
        <div>{`Pages: `}</div>
        <input
          type='text-field'
          value={pages}
          onChange={(e)=>{setPages(parseInt(e.target.value))}}>
        </input>
      </div>
      <div>
        <div>{`Author: `}</div>
        <input
          type='text-field'
          value={author}
          onChange={(e)=>{setAuthor(parseInt(e.target.value))}}>
        </input>
      </div>
      <button onClick={handleAddBook}>{`Add Book`}</button>
    </div>
  )
}
