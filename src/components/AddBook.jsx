import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { GET_BOOKS } from './../App.js'
import { GET_AUTHORS } from './ShowAuthors.jsx'

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

const GET_AUTHOR = gql`
  query get_author($id : ID!) {
    author(id : $id) {
      author {
        id,
        first_name,
        last_name,
      }
    }
  }
`;

export default function AddBook({books, setBookList}) {

  const [title, setTitle] = React.useState('')
  const [authorId, setAuthorId] = React.useState('')
  const [pages, setPages] = React.useState('')

  const [addBook] = useMutation(ADD_BOOK)

  const handleAddBook = () => {
    setTitle('')
    setAuthorId('')
    setPages('')

    addBook({
      variables: {
        title,
        pages,
        author_id: authorId
      },
      update(cache, { data: { addBook } }) {
        try {
          const books = cache.readQuery({
            query: GET_BOOKS
          })
          const newBook = {
            title: title,
            pages: pages,
            author_id: authorId,
            __typename: 'Book',
          }
          // Add new book to cache's list of books
          cache.writeQuery({
            query: GET_BOOKS,
            data: {
              books: [books, newBook]
            }
          })
          // Add new book to author's list of books in cache
          const { authors } = cache.readQuery({ query: GET_AUTHORS })
          const targetAuthor = authors.find(authorRef => parseInt(authorRef.id) === authorId)
          return cache.modify({
            id: cache.identify(targetAuthor),
            fields: {
              books(currentBookRefs, { readfield }) {
                return [...currentBookRefs, newBook]
              }
            }
          })
        } catch(e) {
          console.log("Error: ", e);
        }
      }
    })
  }
  return (
    <div className='add-container'>
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
          value={authorId}
          onChange={(e)=>{setAuthorId(parseInt(e.target.value))}}>
        </input>
      </div>
      <div className='button' onClick={handleAddBook}>{`Add Book`}</div>
    </div>
  )
}
