import { BadgeCheck, MapPin, Banknote, CircleUser, Send } from "lucide-react";
import StarRating from "../lib/StarRating";
const CertificationsSection = ({ certifications, yearsExperience }) => {
  const hasCertifications =
    (certifications && certifications.length > 0) || yearsExperience;

  if (!hasCertifications) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-800 mb-3">
        Verified Credentials
      </h2>
      <div className="flex flex-col gap-3">
        {yearsExperience && (
          <div className="flex items-center gap-2 align-middle">
            <span className="text-green-500 font-bold text-lg">
              <BadgeCheck className="w-4 h-4 mr-1 inline" />
              {yearsExperience === 1
                ? "1 Year of Experience"
                : `${yearsExperience} Years of Experience`}
            </span>
          </div>
        )}
        {certifications && certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                <BadgeCheck className="w-4 h-4 text-green-500" />
                {cert}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;
