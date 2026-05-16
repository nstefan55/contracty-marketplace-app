import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Inquiry from "@/models/Inquiry";
import User from "@/models/User";
import { Eye, MessageSquare, Bookmark, Star, UserPen, Images, ExternalLink } from "lucide-react";

const STATUS_STYLES = {
  new: "bg-orange-100 text-orange-700 border-orange-200",
  read: "bg-slate-100 text-slate-600 border-slate-200",
  replied: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-slate-100 text-slate-500 border-slate-200",
};

export default async function DashboardPage({ params }) {
  const { contractor: slug } = await params;
  const session = await auth();
  if (!session) redirect("/signin");

  await connectDB();
  const contractor = await Contractor.findOne({ slug }).lean();
  if (!contractor) redirect("/");

  const [inquiryCount, recentInquiries, bookmarkCount] = await Promise.all([
    Inquiry.countDocuments({ contractor: contractor._id }),
    Inquiry.find({ contractor: contractor._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("sender", "name email")
      .lean(),
    User.countDocuments({ bookmarks: contractor._id }),
  ]);

  const stats = [
    {
      label: "Profile Views",
      value: contractor.viewCount ?? 0,
      icon: Eye,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Inquiries",
      value: inquiryCount,
      icon: MessageSquare,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      label: "Bookmarks",
      value: bookmarkCount,
      icon: Bookmark,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      label: "Avg Rating",
      value: contractor.averageRating ? contractor.averageRating.toFixed(1) : "—",
      icon: Star,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      sub: contractor.reviewCount ? `${contractor.reviewCount} reviews` : "No reviews yet",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {contractor.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s an overview of your profile activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor, sub }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`inline-flex rounded-lg p-2 mb-3 ${iconBg}`}>
              <Icon size={16} className={iconColor} />
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">Recent Messages</h2>
          <Link
            href="/messages"
            className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <MessageSquare size={24} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">No messages yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentInquiries.map((inq) => {
              const id = inq._id.toString();
              const senderName = inq.sender?.name ?? "Unknown";
              const date = new Date(inq.createdAt).toLocaleDateString("en-IE", {
                day: "numeric",
                month: "short",
              });
              return (
                <li key={id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{senderName}</p>
                    <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                      {inq.projectType} · {inq.description.slice(0, 70)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-slate-400">{date}</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                        STATUS_STYLES[inq.status] ?? STATUS_STYLES.read
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <Link
            href={`/${slug}/dashboard/edit-profile`}
            className="flex items-center gap-4 px-6 py-5 hover:bg-orange-50 transition-colors group"
          >
            <div className="shrink-0 rounded-xl bg-orange-100 p-3">
              <UserPen size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-orange-700 transition-colors">
                Edit Profile
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Update your info &amp; trade</p>
            </div>
          </Link>

          <Link
            href={`/${slug}/dashboard/portfolio`}
            className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors group"
          >
            <div className="shrink-0 rounded-xl bg-slate-100 p-3">
              <Images size={18} className="text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                Upload Portfolio
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Showcase completed projects</p>
            </div>
          </Link>

          <Link
            href={`/${slug}`}
            target="_blank"
            className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors group"
          >
            <div className="shrink-0 rounded-xl bg-slate-100 p-3">
              <ExternalLink size={18} className="text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                Public Profile
              </p>
              <p className="text-xs text-slate-400 mt-0.5">See how clients see you</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
