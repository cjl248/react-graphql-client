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

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    nextFetchPolicy: "cache-first",
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    nextFetchPolicy: "cache-first",
    errorPolicy: 'all',
  },
  mutate: {
    fetchPolicy: 'network-only',
    nextFetchPolicy: "cache-first",
    errorPolicy: 'all',
    awaitRefetchQueries: true
  },
};


const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache({
    defaultOptions,
    addTypeName: true,
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
