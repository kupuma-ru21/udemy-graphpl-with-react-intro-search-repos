import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from "apollo-boost";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
console.log(GITHUB_TOKEN);

const headersLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: { authorization: `Bearer ${GITHUB_TOKEN}` },
  });
  return forward(operation);
});
const endPoint = "https://api.github.com/graphql";
const httpLink = new HttpLink({ uri: endPoint });
const link = ApolloLink.from([headersLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
