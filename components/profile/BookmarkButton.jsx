"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";

import { toggleBookmark as toggleBookmarkAction } from "@/app/actions/User/toggleBookmark";

export default function BookmarkButton({
  contractorId,
  initialBookmarked,
  session,
  contractor,
}) {
  const [saved, setSaved] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await toggleBookmarkAction(contractorId);
      const next = !saved;
      setSaved(next);
      toast.success(next ? "Contractor bookmarked" : "Bookmark removed", {
        iconTheme: {
          primary: "#F54A00",
          secondary: "#ffff",
        },
      });
    } catch (error) {
      toast.error("Something went wrong", {
        iconTheme: {
          primary: "#FF0000",
          secondary: "#ffff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const isOwner =
    session && contractor && session.user.id === contractor._id.toString();

  return (
    <button
      onClick={handleClick}
      disabled={loading || isOwner}
      className={`p-2 rounded-full border transition-colors ${
        isOwner
          ? "bg-gray-100 text-slate-400 cursor-not-allowed border-slate-200"
          : saved
            ? "bg-orange-50 border-orange-200 text-orange-500 hover:bg-orange-100"
            : "bg-gray-100 border-slate-200 text-slate-400 hover:bg-slate-200"
      }`}
      aria-label={saved ? "Remove from bookmarks" : "Bookmark Contractor"}
    >
      <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
