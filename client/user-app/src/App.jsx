import './App.css';
import UserComponent from './UserComponent';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Set up Apollo Client for the gateway
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

function App() {
  return (
    <div className='App'>
      <ApolloProvider client={client}>
        <UserComponent />
      </ApolloProvider>
    </div>
  );
}

export default App;

