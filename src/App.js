import { ApolloProvider, Query, Mutation } from "react-apollo";
import StarButton from "./components/StarButton";
import { client } from "./client";
import { SEARCH_REPOSITORIES } from "./graphql";
import { useHooks } from "./hooks";

const App = () => {
  const { handleChange, goNext, goPrev, changeStar, mutation, variables } =
    useHooks();
  return (
    <ApolloProvider client={client}>
      <form>
        <input
          value={variables.query}
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
                      <Mutation
                        mutation={mutation(node.viewerHasStarred)}
                        refetchQueries={[
                          { query: SEARCH_REPOSITORIES, variables },
                        ]}
                      >
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
