import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Inquiry from "@/models/Inquiry";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export const metadata = { title: "Contractor Dashboard" };

export default async function DashboardLayout({ children, params }) {
  const { contractor: slug } = await params;
  const session = await auth();

  if (!session || session.user.role !== "contractor") redirect("/signin");

  await connectDB();
  const contractor = await Contractor.findOne({
    owner: session.user.id,
  }).lean();

  if (!contractor) redirect("/");
  if (contractor.slug !== slug) redirect(`/${contractor.slug}/dashboard`);

  const unreadCount = await Inquiry.countDocuments({
    contractor: contractor._id,
    status: "new",
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar slug={slug} unreadCount={unreadCount} />
      <div className="flex flex-1 flex-col min-w-0 pt-16 lg:pt-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
