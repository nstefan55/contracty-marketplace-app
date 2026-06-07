import Link from "next/link";

import Image from "next/image";

import StarRating from "@/components/lib/StarRating";

const TestimonialsCard = async ({ review }) => {
  const { _id, rating, comment, user } = review;
  const { name, image: profileImage } = user || {};

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white ">
      {/* Stars + review count */}
      <div className="flex items-center gap-1.5 mt-5 ms-5">
        <span className="text-xs text-slate-500 flex items-center align-middle">
          <StarRating averageRating={rating} />{" "}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5">
        <div className="flex flex-col justify-around gap-2.5">
          {/* Review Description */}
          <p className="text-slate-600">{comment}</p>
          
          {/* Avatar + Name */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-300">
              {profileImage && (
                  <Image
                    src={profileImage}
                    alt={name}
                    className="h-full w-full rounded-full object-cover"
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
              )}
            </div>
            {/* Name */}
            <span className="text-base font-bold text-slate-800">
              {name || "Guest"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCard;
