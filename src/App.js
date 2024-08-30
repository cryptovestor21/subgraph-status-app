import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import SubgraphStatus from './SubgraphStatus';

const client = new ApolloClient({
  uri: 'https://graphtestnetl2.0xcryptovestor.com/status',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <SubgraphStatus />
    </ApolloProvider>
  );
}

export default App;
