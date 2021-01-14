import React from 'react'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOKS = gql`
  {
    books {
      id,
      title,
      pages
    }
  }
`
const Books = () => {
  const { loading, error, data } = useQuery(GET_BOOKS, { errorPolicy: 'all' })
  if (loading) {return (<h1>{`Loading`}</h1>)}
  if (error) {return (<h1>{`Error`}</h1>)}
  const books = data.books
  console.log(books)
  return books.map((book, index) => {
    return (
      <div className='book'>
        {`${book.title} | ${book.pages}`}
      </div>
    )
  })
}

const Main = () => {
  return (
    <div className='book-container'>
      <Books />
    </div>
  )
}

export default Main