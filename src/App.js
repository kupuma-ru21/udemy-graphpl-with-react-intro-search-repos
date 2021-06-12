import { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import { client } from "./client";

const ME = gql`
  query me {
    viewer {
      login
    }
  }
`;

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>Hello</div>
      <Query query={ME}>
        {({ loading, error, data }) => {
          if (loading) return "loading...";
          if (error) return <>{error.message}</>;
          return <>{data.viewer.login}</>;
        }}
      </Query>
    </ApolloProvider>
  );
};

export default App;
