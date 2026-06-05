import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import EditProfileForm from "@/components/profile/EditProfileForm";

export default async function EditProfilePage({ params }) {
  const { contractor: slug } = await params;
  const session = await auth();

  if (!session) redirect("/signin");

  await connectDB();
  const contractor = await Contractor.findOne({ slug }).lean();
  const isContractor = session.user.id === contractor?.owner.toString();
  if (!contractor || !isContractor) redirect("/");

  const data = JSON.parse(JSON.stringify(contractor));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Edit Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update your public contractor profile.
        </p>
      </div>
      <EditProfileForm contractor={data} slug={slug} />
    </div>
  );
}
