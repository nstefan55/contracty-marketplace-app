import Link from "next/link";

import StarRating from "@/components/lib/StarRating";

import { BadgeCheck, Banknote } from "lucide-react";

const ContractorCard = async ({ contractor, profileImages }) => {
  const {
    name,
    slug,
    profileImage,
    trade,
    priceRange,
    averageRating,
    reviewCount,
  } = contractor;

  const hourly = priceRange?.hourly;

  const project = priceRange?.project;

  const currency = priceRange?.currency ?? "EUR";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white max-w-xl items-start">
      {/* Portfolio Photo */}
      <div className="h-44 w-full bg-slate-200">
        {profileImages?.length > 0 ? (
          <Link href={`/contractors/${slug}`}>
            <img
              src={profileImages[0]}
              alt={name}
              className="h-full w-full object-cover"
            />
          </Link>
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm font-medium text-slate-500">
            User has not uploaded any portfolio photos.
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="h-12 w-12 shrink-0 rounded-full bg-slate-300">
            {profileImage && (
              <Link
                href={`/contractors/${slug}`}
                className="h-full w-full rounded-full"
              >
                <img
                  src={profileImage}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full rounded-full object-cover"
                />
              </Link>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-800">{name}</span>
            <span className="text-md text-slate-500">{trade}</span>
          </div>
        </div>

        {/* BADGES */}
        <div className="flex items-center gap-2 flex-wrap my-2">
          {contractor.verified && (
            <span className="bg-green-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              <BadgeCheck className="w-4 h-4 mr-1 inline" />
              Verified
            </span>
          )}
          {contractor.featured && (
            <span className="bg-orange-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              <BadgeCheck className="w-4 h-4 mr-1 inline" />
              Featured
            </span>
          )}
          {contractor.yearsExperience && (
            <span className="bg-blue-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              <BadgeCheck className="w-4 h-4 mr-1 inline" />
              {contractor.yearsExperience} years of experience
            </span>
          )}
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${contractor.available ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            {contractor.available ? "Open to Work" : "Unavailable"}
          </span>
        </div>

        {/* Stars + review count */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 flex items-center align-middle">
            <StarRating averageRating={averageRating} />{" "}
            <span className="ms-2 me-1 text-xs text-slate-500">
              {averageRating}
            </span>{" "}
            ({reviewCount} reviews)
          </span>
        </div>

        {/* Rate */}
        <span className="text-sm font-semibold text-slate-700 flex flex-col gap-1 justify-center mb-2">
          {hourly?.min && (
            <span className="text-slate-700">
              <Banknote className="w-4 h-4 mr-1 inline" />
              {currency} {hourly.min}–{hourly.max}/hour
            </span>
          )}
          {project?.min && (
            <span className="text-slate-700">
              <Banknote className="w-4 h-4 mr-1 inline" />
              {currency} {project.min}–{project.max}/project
            </span>
          )}
        </span>

        {/* Button */}
        <Link
          href={`/contractors/${slug}`}
          className="w-fit rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ContractorCard;
