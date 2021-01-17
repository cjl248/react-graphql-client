import React from 'react'

const Footer = ({setPage}) => {

  const showBooks = () => setPage('show-books')
  const clickAddBook = () => setPage('add-book')

  return (
    <div className='footer-container'>
      <div
        className='button'
        onClick={showBooks}>
        {`Show Books`}
      </div>
      <div
        className='button'
        onClick={clickAddBook}>
        {`Add Books`}
      </div>
    </div>
  )
}

export default Footer
