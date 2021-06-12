import { useCallback, useState } from "react";
import { ADD_STAR, REMOVE_STAR } from "../graphql";
import { PER_PAGE, VARIABLES } from "../constants";

export const useHooks = () => {
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
  const changeStar = useCallback((addStarMutation, id) => {
    addStarMutation({ variables: { input: { starrableId: id } } });
  }, []);
  const mutation = useCallback((viewerHasStarred) => {
    return viewerHasStarred ? REMOVE_STAR : ADD_STAR;
  }, []);

  return {
    handleChange,
    goNext,
    goPrev,
    changeStar,
    mutation,
    variables,
  };
};
