import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Inquiry from "@/models/Inquiry";
import User from "@/models/User";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentMessages from "@/components/dashboard/RecentMessages";
import Stats from "@/components/dashboard/Stats";

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
      <Stats
        contractor={contractor}
        inquiryCount={inquiryCount}
        bookmarkCount={bookmarkCount}
      />

      {/* Recent Messages */}
      <RecentMessages
        inquiries={recentInquiries}
        contractorId={contractor._id}
      />

      {/* Quick Actions Component*/}
      <QuickActions slug={slug} />
    </div>
  );
}
