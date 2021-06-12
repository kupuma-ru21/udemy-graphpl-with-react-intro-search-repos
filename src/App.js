import { useCallback, useState } from "react";
import { ApolloProvider, Query } from "react-apollo";
import { client } from "./client";
import { SEARCH_REPOSITORIES } from "./graphql";

const PER_PAGE = 5;
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
  const goNext = useCallback((endCursor) => {
    setVariables((oldVariables) => {
      return {
        ...oldVariables,
        after: endCursor,
        first: PER_PAGE,
        last: null,
        before: null,
      };
    });
  }, []);
  const goPrev = useCallback((startCursor) => {
    setVariables((oldVariables) => {
      console.log(startCursor);
      return {
        ...oldVariables,
        ...oldVariables,
        after: null,
        first: null,
        last: PER_PAGE,
        before: startCursor,
      };
    });
  }, []);

  const { query } = variables;
  return (
    <ApolloProvider client={client}>
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
          const pageInfo = data.search.pageInfo;
          const { endCursor, hasNextPage, startCursor, hasPreviousPage } =
            pageInfo;
          const repositoryUnit =
            search.repositoryCount === 1 ? "Repository" : "Repositories";
          return (
            <>
              <h2>
                GitHub Repositories Search Results -
                {data.search.repositoryCount}
                {repositoryUnit}
              </h2>
              <ul>
                {search.edges.map(({ node }) => {
                  return (
                    <li key={node.id}>
                      <a href={node.url} target="__blank">
                        {node.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {hasPreviousPage && (
                <button onClick={() => goPrev(startCursor)}>Prev</button>
              )}
              {hasNextPage && (
                <button onClick={() => goNext(endCursor)}>Next</button>
              )}
            </>
          );
        }}
      </Query>
    </ApolloProvider>
  );
};

export default App;
