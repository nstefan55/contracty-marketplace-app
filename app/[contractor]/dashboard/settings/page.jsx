import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import User from "@/models/User";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage({ params }) {
  const { contractor: slug } = await params;
  const session = await auth();
  if (!session) redirect("/signin");

  await connectDB();
  const [contractor, user] = await Promise.all([
    Contractor.findOne({ slug }).lean(),
    User.findById(session.user.id).lean(),
  ]);
  if (!contractor) redirect("/");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-dark-text">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and profile preferences.
        </p>
      </div>
      <SettingsClient
        slug={slug}
        available={contractor.available}
        hasPassword={!!user?.password}
        email={user?.email ?? ""}
      />
    </div>
  );
}
