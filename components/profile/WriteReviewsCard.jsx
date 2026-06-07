"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { createReview } from "@/app/actions/review-actions";
import toast from "react-hot-toast";

export default function WriteReviewsCard({
  contractorId,
  isLoggedIn,
  isOwnProfile,
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (isOwnProfile) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setLoading(true);
    try {
      await createReview(contractorId, { rating, comment });
      toast.success("Review submitted!");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
      <h3 className="text-base font-bold text-slate-800 mb-4">
        Leave a Review
      </h3>

      {submitted ? (
        <p className="text-sm text-green-600 font-medium">
          Thank you — your review has been submitted!
        </p>
      ) : !isLoggedIn ? (
        <p className="text-sm text-slate-500">
          Sign in to leave a review for this contractor.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={26}
                  className={`transition-colors ${
                    star <= (hover || rating)
                      ? "fill-orange-400 stroke-orange-400"
                      : "stroke-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            maxLength={1000}
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
