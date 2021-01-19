import React from 'react'

const Footer = ({setPage}) => {

  const showBooks = () => setPage('show-books')
  const addBook = () => setPage('add-book')
  const showAuthors = () => setPage('show-authors')
  const addAuthor = () => setPage('add-author')

  return (
    <div className='footer-container'>
      <div
        className='button'
        onClick={showBooks}>
        {`Show Books`}
      </div>
      <div
        className='button'
        onClick={addBook}>
        {`Add a Book`}
      </div>
      <div
        className='button'
        onClick={showAuthors}>
        {`Show Authors`}
      </div>
      <div
        className='button'
        onClick={addAuthor}>
        {`Add an Author`}
      </div>
    </div>
  )
}

export default Footer
