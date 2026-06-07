import Link from "next/link";

import Image from "next/image";

import StarRating from "@/components/lib/StarRating";

import { Banknote } from "lucide-react";

const FeaturedContractorCard = async ({ contractor, profileImages }) => {
  const {
    slug,
    name,
    trade,
    averageRating,
    reviewCount,
    profileImage,
    priceRange,
  } = contractor;

  const hourly = priceRange?.hourly;

  const project = priceRange?.project;

  const currency = priceRange?.currency ?? "EUR";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white ">
      {/* Portfolio Photo */}
      <div className="h-44 w-full bg-slate-200">
        {profileImages?.length > 0 && (
          <Link href={`/contractors/${slug}`}>
            <Image
              src={profileImages[0]}
              alt={name}
              width={400}
              height={200}
              className="h-full w-full object-cover"
            />
          </Link>
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
                  className="h-full w-full rounded-full object-cover"
                />
              </Link>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-800">{name}</span>
            <span className="text-xs text-slate-500">{trade}</span>
          </div>
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

export default FeaturedContractorCard;
