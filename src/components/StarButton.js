import { memo } from "react";

const StarButton = ({ totalCount, viewerHasStarred }) => {
  const starUnit = totalCount === 1 ? "star" : "stars";
  const hasStarred = viewerHasStarred ? " | Starred" : " | -";
  return (
    <button>
      <span>
        {totalCount}
        {starUnit}
      </span>
      <span>{hasStarred}</span>
    </button>
  );
};

export default memo(StarButton);
