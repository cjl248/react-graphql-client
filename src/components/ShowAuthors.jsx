import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { GET_BOOKS } from './../App.js'

export const GET_AUTHORS = gql`
  query getAuthors {
    authors {
      id,
      first_name,
      last_name,
      books {
        id,
        title
      }
    }
  }
`;

export const DELETE_AUTHOR = gql`
  mutation deleteAuthor($id: ID!) {
    delete_author(id: $id) {
      author {
        id,
        first_name,
        last_name
      }
    }
  }
`;

const GetAuthors = () => {

  const [deleteAuthor] = useMutation(DELETE_AUTHOR)

  const listBooks = (books) => {
    return books.map((book, index)=> {
      return (
        <span className='book' key={book.id}>
          {`[${index+1}] ${book.title}`}
        </span>
      )
    })
  }

  const handleDeleteAuthor = (id) => {
    deleteAuthor({
      variables: {
        id
      },
      update(cache, { data: { deleteAuthor } }) {
        try {
          const authorData = cache.readQuery({query: GET_AUTHORS})
          const updatedAuthorList = authorData.authors.filter(author => {
            return author.id !== id
          })
          const authorToDelete = cache.readQuery({query: GET_AUTHORS}).authors.find(author => {
            return author.id === id
          })
          // Remove author from the cache's list of authors
          cache.writeQuery({
            query: GET_AUTHORS,
            data: {
              authors: [...updatedAuthorList],
            }
          })
          // Remove the author's books from cache's list of books
          return cache.modify({
            id: cache.identify(authorToDelete),
            fields: {
              books(existingBookRefs, { readField }) {
              existingBookRefs.map(bookRef => {
                return cache.evict(bookRef)
              })
                return []
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

  const { data, loading, error } = useQuery(GET_AUTHORS)
  if (error) return <h1>{`Error: ${error}`}</h1>
  if (loading) return <h1>{`Loading...`}</h1>
  try {
    return data.authors.map(author => {
      return (
        <div className='author' key={author.id}>
          <div className='first-name'>{`First Name: ${author.first_name}`}</div>
          <div className='last-name'>{`Last Name: ${author.last_name}`}</div>
          <div className='books'>{listBooks(author.books)}</div>
          <div
            className='button'
            onClick={() => {handleDeleteAuthor(author.id)}}>
            {`Remove`}
          </div>
        </div>
      )
    })
  } catch (e) {
    return <h1>{`An error occured: ${e}`}</h1>
  }
}


export default function ShowAuthors() {
  return (
    <div className='show-authors-container'>
      <GetAuthors />
    </div>
  )
}
