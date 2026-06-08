import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Inquiry from "@/models/Inquiry";
import Contractor from "@/models/Contractor";
import { MessagesBreadcrumbNav } from "@/components/MessagesBreadcrumbNav";
import InquiryCard from "@/components/InquiryCard";
import convertToSerializableObject from "@/app/utils/convertToObject";

export default async function MessagesPage() {
  const session = await auth();
  if (!session) redirect("/signin");

  await connectDB();

  let inquiriesDoc = [];
  let contractorSlug = null;

  if (session.user.role === "contractor") {
    const contractor = await Contractor.findOne({
      owner: session.user.id,
    }).lean();
    if (contractor) {
      contractorSlug = contractor.slug;
      inquiriesDoc = await Inquiry.find({ contractor: contractor._id })
        .populate("sender", "name email image")
        .populate("recipient", "name email")
        .sort({ createdAt: -1 })
        .lean();
    }
  } else {
    inquiriesDoc = await Inquiry.find({ sender: session.user.id })
      .populate("sender", "name email image")
      .populate("recipient", "name email")
      .populate("contractor", "name slug trade")
      .sort({ createdAt: -1 })
      .lean();
  }

  const inquiries = convertToSerializableObject(inquiriesDoc);

  const isContractor = session.user.role === "contractor";

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <MessagesBreadcrumbNav slug={contractorSlug} />
        <div>
          <h1 className="text-2xl font-semibold text-dark-text">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isContractor
              ? "Inquiries from homeowners about your services."
              : "Your inquiries to contractors."}
          </p>
        </div>
        <InquiryCard
          inquiries={inquiries}
          session={session}
          isContractor={isContractor}
        />
      </div>
    </div>
  );
}
