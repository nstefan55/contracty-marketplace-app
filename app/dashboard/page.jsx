import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";

export default async function DashboardRedirectPage() {
  const session = await auth();

  if (!session) redirect("/signin");
  if (session.user.role !== "contractor") redirect("/");

  await connectDB();
  const contractor = await Contractor.findOne({ owner: session.user.id }).lean();

  if (!contractor) redirect("/onboarding/welcome");

  redirect(`/${contractor.slug}/dashboard`);
}
