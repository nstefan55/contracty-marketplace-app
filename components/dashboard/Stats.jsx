import { Eye, MessageSquare, Bookmark, Star } from "lucide-react";

const Stats = ({ contractor, inquiryCount, bookmarkCount }) => {
  const stats = [
    {
      label: "Profile Views",
      value: contractor.viewCount ?? 0,
      icon: Eye,
      iconBg: "bg-[#071427]",
      iconColor: "text-white",
    },
    {
      label: "Inquiries",
      value: inquiryCount,
      icon: MessageSquare,
      iconBg: "bg-[#FF6900]",
      iconColor: "text-white",
    },
    {
      label: "Bookmarks",
      value: bookmarkCount,
      icon: Bookmark,
      iconBg: "bg-[#071427]",
      iconColor: "text-white",
    },
    {
      label: "Avg Rating",
      value: contractor.averageRating
        ? contractor.averageRating.toFixed(1)
        : "—",
      icon: Star,
      iconBg: "bg-[#FF6900]",
      iconColor: "text-white",
      sub: contractor.reviewCount
        ? `${contractor.reviewCount} reviews`
        : "No reviews yet",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, iconBg, iconColor, sub }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className={`inline-flex rounded-lg p-2 mb-3 ${iconBg}`}>
            <Icon size={16} className={iconColor} />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-none">
            {value}
          </p>
          <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      ))}
    </div>
  );
};

export default Stats;
