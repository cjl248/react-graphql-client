import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client'


const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache({
    optimistic: true,
    typePolicies: {
      Book: {
        keyArgs: ["id", "title"],
        merge(existing, incoming){
          let books = []
          if (existing && existing.books) {
            books = books.concat(existing.books)
          }
          if (incoming && incoming.books) {
            books = books.concat(incoming.books)
          }
          return {
            ...incoming,
            books,
          }
        }
      },
      Author: {
        keyArgs: ["id", "last_name"],
        merge(existing, incoming) {
          let authors = []
          if (existing && existing.authors) {
            authors = authors.concat(existing.authors)
          }
          if (incoming && incoming.authors) {
            authors = authors.concat(incoming.authors)
          }
          return {
            ...incoming,
            authors,
          }
        }
      }
    }
  }),
});

function ApolloApp() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
}

ReactDOM.render(<ApolloApp />, document.getElementById('root'));


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
