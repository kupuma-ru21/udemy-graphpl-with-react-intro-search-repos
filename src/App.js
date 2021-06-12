import { useCallback, useState } from "react";
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
  const handleChange = useCallback((e) => {
    setVariables((oldVariables) => {
      return { ...oldVariables, query: e.target.value };
    });
  }, []);

  const { query } = variables;
  return (
    <ApolloProvider client={client}>
      <div>Hello</div>
      <form>
        <input
          value={query}
          onChange={handleChange}
          style={{ width: "200px" }}
        />
      </form>
      <Query query={SEARCH_REPOSITORIES} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return "loading...";
          if (error) return <>{error.message}</>;
          console.log(data.search);
          const search = data.search;
          const repositoryUnit =
            search.repositoryCount === 1 ? "Repository" : "Repositories";
          return (
            <h2>
              GitHub Repositories Search Results - {data.search.repositoryCount}
              {repositoryUnit}
            </h2>
          );
        }}
      </Query>
    </ApolloProvider>
  );
};

export default App;
