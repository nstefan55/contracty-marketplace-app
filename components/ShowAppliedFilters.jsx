"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Star, MapPin, Banknote } from "lucide-react";

const ShowAppliedFilters = () => {
  const router = useRouter();
  const sp = useSearchParams();

  const removeFilter = (key) => {
    const params = new URLSearchParams(sp.toString());
    params.delete(key);
    const qs = params.toString();
    router.push(qs ? `/contractors?${qs}` : "/contractors");
  };

  const serviceArea = sp.get("serviceArea");
  const trade = sp.get("trade");
  const postcode = sp.get("serviceArea.postcode");
  const hourlyMin = sp.get("priceRange.hourly.min");
  const hourlyMax = sp.get("priceRange.hourly.max");
  const projectMin = sp.get("priceRange.project.min");
  const projectMax = sp.get("priceRange.project.max");
  const ratingMin = sp.get("averageRating.min");
  const ratingMax = sp.get("averageRating.max");
  const experienceMin = sp.get("yearsExperience.min");
  const available = sp.get("available") === "true";
  const verified = sp.get("verified") === "true";

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {serviceArea && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          {serviceArea}
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("serviceArea")}
          />
        </div>
      )}
      {trade && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          {trade}
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("trade")}
          />
        </div>
      )}
      {postcode && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <MapPin className="w-4 h-4 mr-1" />
          {postcode}
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("serviceArea.postcode")}
          />
        </div>
      )}
      {hourlyMin && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Banknote className="w-4 h-4 mr-1" />
          Hourly Min Rate: {hourlyMin} EUR
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("priceRange.hourly.min")}
          />
        </div>
      )}
      {hourlyMax && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Banknote className="w-4 h-4 mr-1" />
          Hourly Max Rate: {hourlyMax} EUR
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("priceRange.hourly.max")}
          />
        </div>
      )}
      {projectMin && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Banknote className="w-4 h-4 mr-1" />
          Project Min Rate: {projectMin} EUR
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("priceRange.project.min")}
          />
        </div>
      )}
      {projectMax && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Banknote className="w-4 h-4 mr-1" />
          Project Max Rate: {projectMax} EUR
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("priceRange.project.max")}
          />
        </div>
      )}

      {ratingMin && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          Minimum Rating: {ratingMin}{" "}
          <Star className="w-4 h-4 text-yellow-400" />
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => {
              removeFilter("averageRating.min");
            }}
          />
        </div>
      )}
      {ratingMax && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          Maximum Rating: {ratingMax}{" "}
          <Star className="w-4 h-4 text-yellow-400" />
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => {
              removeFilter("averageRating.max");
            }}
          />
        </div>
      )}
      {experienceMin && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          {experienceMin}+ years
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("yearsExperience.min")}
          />
        </div>
      )}
      {available && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          {available && "Available Now"}
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("available")}
          />
        </div>
      )}
      {verified && (
        <div className="text-white bg-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          {verified && "Verified Only"}
          <X
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={() => removeFilter("verified")}
          />
        </div>
      )}
    </div>
  );
};

export default ShowAppliedFilters;
