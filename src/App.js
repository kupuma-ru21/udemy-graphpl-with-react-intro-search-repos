import { useCallback, useState } from "react";
import { ApolloProvider, Query, Mutation } from "react-apollo";
import { client } from "./client";
import { SEARCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from "./graphql";
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
  const changeStar = useCallback((addStarMutation, id) => {
    addStarMutation({ variables: { input: { starrableId: id } } });
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
  const mutation = useCallback((viewerHasStarred) => {
    return viewerHasStarred ? REMOVE_STAR : ADD_STAR;
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
                  return (
                    <li key={node.id}>
                      <a href={node.url} target="__blank">
                        {node.name}
                      </a>
                      <Mutation mutation={mutation(node.viewerHasStarred)}>
                        {(mutation) => (
                          <StarButton
                            totalCount={node.stargazers.totalCount}
                            viewerHasStarred={node.viewerHasStarred}
                            onClick={() => changeStar(mutation, node.id)}
                          />
                        )}
                      </Mutation>
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
