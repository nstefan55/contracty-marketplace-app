import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Portfolio from "@/models/Portfolio";
import PortfolioManager from "./PortfolioManager";

export default async function PortfolioPage({ params }) {
  const { contractor: slug } = await params;
  const session = await auth();
  if (!session) redirect("/signin");

  await connectDB();
  const contractor = await Contractor.findOne({ slug }).lean();
  if (!contractor) redirect("/");

  const items = await Portfolio.find({ contractor: contractor._id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-dark-text">My Portfolio</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Showcase your completed projects to attract clients.
        </p>
      </div>
      <PortfolioManager
        items={JSON.parse(JSON.stringify(items))}
        slug={slug}
      />
    </div>
  );
}
