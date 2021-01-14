import './app.scss';
import Header from './components/Header.jsx'
import Main from './components/Main.jsx'
import Footer from './components/Footer.jsx'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql"
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="app">
        <Header />
        <Main />
        <Footer />
      </div>
    </ApolloProvider>
  )
}

export default App;
