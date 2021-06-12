import { useCallback, useRef, useState } from "react";
import { ADD_STAR, REMOVE_STAR, SEARCH_REPOSITORIES } from "../graphql";
import { PER_PAGE, VARIABLES } from "../constants";

export const useHooks = () => {
  const [variables, setVariables] = useState(VARIABLES);
  const myRef = useRef();
  const handleSubmit = useCallback(() => {
    setVariables((oldVariables) => {
      return { ...oldVariables, variables: myRef.current.value };
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
  const changeStar = useCallback(
    (mutation, id) => {
      mutation({
        variables: { input: { starrableId: id } },
        update: (store) => {
          const data = store.readQuery({
            query: SEARCH_REPOSITORIES,
            variables,
          });
          const edges = data.search.edges;
          const newEdges = edges.map(({ node }) => {
            if (node.id === id) {
              const totalCount = node.stargazers.totalCount;
              const diff = node.viewerHasStarred ? -1 : 1;
              const newTotalCount = totalCount + diff;
              node.stargazers.totalCount = newTotalCount;
            }
            return edges;
          });
          data.search.edges = newEdges;
          store.writeQuery({ query: SEARCH_REPOSITORIES, data });
        },
      });
    },
    [variables]
  );
  const mutation = useCallback((viewerHasStarred) => {
    return viewerHasStarred ? REMOVE_STAR : ADD_STAR;
  }, []);

  return {
    goNext,
    goPrev,
    changeStar,
    mutation,
    variables,
    myRef,
    handleSubmit,
  };
};
