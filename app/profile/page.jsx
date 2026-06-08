import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, MessageSquare, X } from "lucide-react";
import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import User from "@/models/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileNameForm from "@/components/profile/ProfileNameForm";
import DeleteAccountCard from "@/components/profile/DeleteAccountCard";

export const metadata = { title: "Your Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/signin");
  if (session.user.role === "contractor") redirect("/dashboard");

  await connectDB();
  const user = await User.findById(session.user.id)
    .select("name email image bookmarks createdAt password")
    .lean();

  if (!user) redirect("/signin");

  const hasPassword = Boolean(user.password);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IE", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Your Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account details.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Image
            src={user.image}
            alt={user.name || "Profile"}
            width={64}
            height={64}
            className="rounded-full shrink-0"
          />
          <div className="min-w-0">
            <p className="text-base font-semibold text-slate-900 truncate">
              {user.name || "Unnamed"}
            </p>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              Member since {memberSince}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display Name</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileNameForm
            currentName={user.name || ""}
            currentEmail={user.email || ""}
          />
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/contractors/saved" className="block">
          <Card className="hover:bg-slate-50 transition-colors h-full">
            <CardContent className="flex items-center gap-3 pt-6">
              <Bookmark className="h-5 w-5 text-orange-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  Saved contractors
                </p>
                <p className="text-xs text-slate-500">
                  {user.bookmarks?.length || 0} saved
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/messages" className="block">
          <Card className="hover:bg-slate-50 transition-colors h-full">
            <CardContent className="flex items-center gap-3 pt-6">
              <MessageSquare className="h-5 w-5 text-orange-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">Messages</p>
                <p className="text-xs text-slate-500">View conversations</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/" className="block">
          <Card className="hover:bg-slate-50 transition-colors h-full">
            <CardContent className="flex items-center gap-3 pt-6">
              <X className="h-5 w-5 text-orange-500 shrink-0" />
              Exit Profile
            </CardContent>
          </Card>
        </Link>
        <DeleteAccountCard hasPassword={hasPassword} email={user.email} />
      </div>
    </main>
  );
}
