"use client";
import { useState } from "react";
import Image from "next/image";
import StarRating from "../lib/StarRating";

const pageSize = 3;

const ReviewSection = ({ reviews, totalCount }) => {
  const [visible, setVisible] = useState(pageSize);

  if (!reviews || reviews.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          What Clients Say
        </h2>
        <p className="text-sm text-slate-400">
          No reviews yet. Check back soon!
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[22px] font-bold text-slate-800">
          What Clients Say ({totalCount} reviews)
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {reviews.slice(0, visible).map((review) => (
          <div
            key={review._id}
            className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-2"
          >
            {/* Reviewer Information */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0">
                {review.user?.image && (
                  <Image
                    src={review.user.image}
                    alt={review.user.name}
                    width={36}
                    height={36}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {review.user?.name ?? "Anonymous"}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString("en-IE", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            {/* Review Stars */}
            <StarRating averageRating={review.rating} />
            {/* Review Comment */}
            <p className="text-sm text-slate-600 max-w-xl">{review.comment}</p>
          </div>
        ))}
      </div>
      {visible < reviews.length && (
        <button
          className="mt-4 w-full py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-[#FF6900] hover:text-white hover:font-bold transition-colors"
          onClick={() => setVisible((v) => v + pageSize)}
        >
          Load More Reviews
        </button>
      )}
    </section>
  );
};

export default ReviewSection;
