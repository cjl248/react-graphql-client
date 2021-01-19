import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { GET_AUTHORS } from './ShowAuthors.jsx'

export const ADD_AUTHOR = gql`
mutation add_author($first_name: String!, $last_name: String!) {
  add_author(first_name: $first_name, last_name: $last_name) {
    author {
      id,
      first_name,
      last_name,
      books {
        title
      }
    }
    success
  }
}
`;

export default function AddAuthor() {

  const [addAuthor] = useMutation(ADD_AUTHOR)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleAddAuthor = () => {
    setLastName('')
    setFirstName('')
    addAuthor({
      variables: {
        first_name: firstName,
        last_name: lastName,
      },
      update(cache, { data: { addAuthor } }) {
        try {
          const { authors } = cache.readQuery({query: GET_AUTHORS})
          const newAuthor = {
            first_name: firstName,
            last_name: lastName,
            __typename: 'Author'
          }

          // Add new author to cache's list of authors
          return cache.writeQuery({
            query: GET_AUTHORS,
            data: {
              authors: [authors, newAuthor]
            }
          })
        } catch(e) {
          console.log(`Error: ${e}`);
        }
      }
    })
  }

  return (
    <div className='add-container'>
      <div className='input-group'>
        <div className='label'>{`First Name: `}</div>
        <input
          className='input'
          type='text-field'
          value={firstName}
          onChange={(e) => {setFirstName(e.target.value)}}>
        </input>
      </div>
      <div className='input-group'>
        <div className='label'>{`Last Name: `}</div>
        <input
          className='input'
          type='text-field'
          onChange={(e) => {setLastName(e.target.value)}}>
        </input>
      </div>
      <div
        className='button'
        onClick={handleAddAuthor}>
        {`Add Author`}
      </div>
    </div>
  )
}
