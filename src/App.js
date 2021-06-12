import { useCallback, useState } from "react";
import { ApolloProvider, Query } from "react-apollo";
import { client } from "./client";
import { SEARCH_REPOSITORIES } from "./graphql";
import { PER_PAGE, VARIABLES } from "./constants";
import StarButton from "./components/StarButton";

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
      return {
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
                  console.log(node);
                  return (
                    <li key={node.id}>
                      <a href={node.url} target="__blank">
                        {node.name}
                      </a>
                      <StarButton
                        totalCount={node.stargazers.totalCount}
                        viewerHasStarred={node.viewerHasStarred}
                      />
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
