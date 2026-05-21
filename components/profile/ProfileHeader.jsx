import Image from "next/image";
import { BadgeCheck, MapPin, Banknote, CircleUser, Send } from "lucide-react";
import StarRating from "../lib/StarRating";
import BookmarkButton from "./BookmarkButton";

export default function ProfileHeader({
  contractor,
  bookmarkCount,
  isBookmarked,
  session,
  isOwnProfile,
}) {
  const hourly = contractor.priceRange?.hourly;
  const project = contractor.priceRange?.project;
  const currency = contractor.priceRange?.currency ?? "EUR";

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        {/* AVATAR */}
        <div className="w-24 h-24 sm:w-30 sm:h-30 rounded-full overflow-hidden bg-slate-200 shrink-0">
          <Image
            src={contractor.profileImage}
            alt={contractor.name}
            width={120}
            height={120}
            className="w-full h-full object-cover"
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          {/* NAME */}
          <h1 className="text-2xl font-bold text-slate-800 leading-tight">
            {contractor.name}
          </h1>
          {/* BADGES */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-orange-50 text-orange-500 text-xl font-medium px-3 py-0 5 rounded-full">
              {contractor.trade}
            </span>
            {contractor.verified && (
              <span className="bg-green-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                <BadgeCheck className="w-4 h-4 mr-1 inline" />
                Verified
              </span>
            )}
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${contractor.available ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {contractor.available ? "Open to Work" : "Unavailable"}
            </span>
          </div>
          {/* RATING */}
          <div className="flex items-center gap-2">
            <StarRating averageRating={contractor.averageRating} />
            <span className="text-sm text-slate-500">
              {contractor.averageRating
                ? `${contractor.averageRating.toFixed(1)} (${contractor.reviewCount} reviews)`
                : "No reviews yet"}
            </span>
          </div>
          {/* PROFILE BIO */}
          {contractor.bio && (
            <p className="text-sm text-slate-700 max-w-2xl">{contractor.bio}</p>
          )}
          {/* DETAILS ROW */}
          <div className="flex items-center gap-6 flex-wrap text-[13px]">
            {contractor.serviceArea?.address && (
              <span className="text-slate-500">
                <MapPin className="w-4 h-4 mr-1 inline" />
                {contractor.serviceArea.address}
              </span>
            )}
            {hourly?.min && (
              <span className="text-slate-700">
                <Banknote className="w-4 h-4 mr-1 inline" />
                {currency} {hourly.min}–{hourly.max}/hr
              </span>
            )}
            {project?.min && (
              <span className="text-slate-700">
                <Banknote className="w-4 h-4 mr-1 inline" />
                {currency} {project.min}–{project.max}/project
              </span>
            )}
          </div>
          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 mt-1">
            {session && !isOwnProfile && (
              <>
                <a
                  href="#inquiry-form"
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <CircleUser className="w-4 h-4 mr-1 inline" />
                  Contact
                </a>
                <a
                  href="#inquiry-form"
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  <Send className="w-4 h-4 mr-1 inline" />
                  Send Inquiry
                </a>
                <BookmarkButton
                  contractorId={contractor._id}
                  initialBookmarked={isBookmarked}
                  session={session}
                  bookmarkCount={bookmarkCount}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
