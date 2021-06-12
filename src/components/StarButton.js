import { memo } from "react";

const StarButton = ({ totalCount }) => {
  const starUnit = totalCount === 1 ? "star" : "stars";
  return (
    <button>
      {totalCount}
      {starUnit}
    </button>
  );
};

export default memo(StarButton);
