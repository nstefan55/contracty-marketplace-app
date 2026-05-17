"use client";

import { useState } from "react";
import { Bookmark, BookmarkFilled } from "lucide-react";

import toast from "react-hot-toast";

export default function BookmarkButton({
  contractorId,
  initialBookmarked,
  session,
  contractor,
}) {
  const [saved, setSaved] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      await toggleBookmark(contractorId);
      setSaved((prev) => !prev);
      toast.success(saved ? "Removed from bookmarks" : "Added to bookmarks");
    } catch (error) {
      toast.error(error.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${session && contractor && session.user.id === contractor._id.toString() ? "bg-red-500 none text-slate-400 cursor-not-allowed" : ""} ${saved ? "bg-orange-50 border-orange-200 text-orange-500" : "border-slate-200 text-slate-400 hover:bg-slate-50"}`}
      aria-label={saved ? "Remove from bookmarks" : "Bookmark Contractor"}
    >
      <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
