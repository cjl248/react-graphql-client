import './app.scss';
import React from 'react'
// import Posts from './components/Posts.jsx'
import Header from './components/Header.jsx'
import Main from './components/Main.jsx'
import Footer from './components/Footer.jsx'
import {
  gql,
  useQuery,
} from '@apollo/client'

export const GET_BOOKS = gql`
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

export default function App() {

  const [page, setPage] = React.useState('show-authors')

  const { loading, error, data } = useQuery( GET_BOOKS )
  if (loading) return <h1>{`Loading`}</h1>
  if (error) return <h1>{`Error`}</h1>
  const books = data.books
  return (
    <div className="app">
      <Header />
      <Main page={page} books={books}/>
      <Footer setPage={setPage} />
    </div>
  )
}
