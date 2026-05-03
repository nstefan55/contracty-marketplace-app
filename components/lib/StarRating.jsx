"use client";

import { Rating } from "next-flex-rating";

const StarRating = ({ averageRating }) => {
  return (
    <div className="flex items-center">
      <Rating value={averageRating} readOnly={true} size={15} />
    </div>
  );
};

export default StarRating;
