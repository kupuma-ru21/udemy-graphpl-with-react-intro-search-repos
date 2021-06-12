import { useState } from "react";
import { ApolloProvider, Query } from "react-apollo";
import { client } from "./client";
import { SEARCH_REPOSITORIES } from "./graphql";

const VARIABLES = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア",
};

const App = () => {
  const [variables, setVariables] = useState(VARIABLES);

  return (
    <ApolloProvider client={client}>
      <div>Hello</div>
      <Query query={SEARCH_REPOSITORIES} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return "loading...";
          if (error) return <>{error.message}</>;
          return <></>;
        }}
      </Query>
    </ApolloProvider>
  );
};

export default App;
