import Link from "next/link";

const FeaturedContractorCard = ({ contractor }) => {
  const {
    _id,
    name,
    trade,
    rating,
    reviewCount,
    rateMin,
    rateMax,
    profileImage,
  } = contractor;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white ">
      {/* Photo */}
      <div className="h-44 w-full bg-slate-200">
        {profileImage && (
          <img
            src={profileImage}
            alt={name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5">
        {/* Avatar + Name / Trade */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 shrink-0 rounded-full bg-slate-300" />
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-800">{name}</span>
            <span className="text-xs text-slate-500">{trade}</span>
          </div>
        </div>

        {/* Stars + review count */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-amber-400">★★★★★</span>
          <span className="text-xs text-slate-500">
            {rating} ({reviewCount} reviews)
          </span>
        </div>

        {/* Rate */}
        <span className="text-sm font-semibold text-slate-700">
          £{rateMin} – £{rateMax} / hour
        </span>

        {/* Button */}
        <Link
          href={`/contractors/${_id}`}
          className="w-fit rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default FeaturedContractorCard;
