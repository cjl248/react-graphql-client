import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { GET_BOOKS } from './../App.js'

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

export default function AddBook({books, setBookList}) {

  const [title, setTitle] = React.useState('')
  const [author, setAuthor] = React.useState('')
  const [pages, setPages] = React.useState('')

  const [addBook] = useMutation(ADD_BOOK)

  const handleAddBook = () => {
    setTitle('')
    setAuthor('')
    setPages('')

    addBook({
      variables: {
        title,
        pages,
        author_id: author
      },
      update(cache, { data: { addBook } }) {
        try {
          const books = cache.readQuery({
            query: GET_BOOKS
          })
          const newBook = {
            title: title,
            pages: pages,
            author_id: author,
            __typename: 'Book',
          }
          return cache.writeQuery({
            query: GET_BOOKS,
            data: {
              books: [books, newBook]
            }
          })
        } catch(e) {
          console.log("Error: ", e);
        }
      }
    })
  }
  return (
    <div className='add-book-container'>
      <div className='input-group'>
        <div className='label'>{`Title: `}</div>
        <input className='input'
          type='text-field'
          value={title}
          onChange={(e)=>{setTitle(e.target.value)}}>
        </input>
      </div>
      <div className='input-group'>
        <div className='label'>{`Pages: `}</div>
        <input className='input'
          type='text-field'
          value={pages}
          onChange={(e)=>{setPages(parseInt(e.target.value))}}>
        </input>
      </div>
      <div className='input-group'>
        <div className='label'>{`Author: `}</div>
        <input className='input'
          type='text-field'
          value={author}
          onChange={(e)=>{setAuthor(parseInt(e.target.value))}}>
        </input>
      </div>
      <div className='button' onClick={handleAddBook}>{`Add Book`}</div>
    </div>
  )
}
