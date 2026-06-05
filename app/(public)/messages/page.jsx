import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Inquiry from "@/models/Inquiry";
import Contractor from "@/models/Contractor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { MessagesBreadcrumbNav } from "@/components/MessagesBreadcrumbNav";

const STATUS_VARIANT = {
  new: "default",
  read: "secondary",
  replied: "outline",
  closed: "secondary",
};

export default async function MessagesPage() {
  const session = await auth();
  if (!session) redirect("/signin");

  await connectDB();

  let inquiries = [];
  let contractorSlug = null;

  if (session.user.role === "contractor") {
    const contractor = await Contractor.findOne({
      owner: session.user.id,
    }).lean();
    if (contractor) {
      contractorSlug = contractor.slug;
      inquiries = await Inquiry.find({ contractor: contractor._id })
        .populate("sender", "name email image")
        .sort({ createdAt: -1 })
        .lean();
    }
  } else {
    inquiries = await Inquiry.find({ sender: session.user.id })
      .populate("contractor", "name slug trade")
      .sort({ createdAt: -1 })
      .lean();
  }

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

        {inquiries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <MessageSquare size={32} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inq) => {
              const id = inq._id.toString();
              const date = new Date(inq.createdAt).toLocaleDateString("en-IE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              const contactName = isContractor
                ? (inq.sender?.name ?? "User")
                : (inq.contractor?.name ?? "User");

              const subLine = isContractor
                ? inq.sender?.email
                : `${inq.contractor?.trade ?? ""}`;

              return (
                <Card key={id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-dark-text">
                          {contactName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {subLine}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {date}
                        </span>
                        <Badge
                          variant={STATUS_VARIANT[inq.status] ?? "default"}
                        >
                          {inq.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>
                        <span className="font-medium text-foreground">
                          Project:{" "}
                        </span>
                        {inq.projectType}
                      </p>
                      {inq.budget && (
                        <p>
                          <span className="font-medium text-foreground">
                            Budget:{" "}
                          </span>
                          {inq.budget}
                        </p>
                      )}
                      {inq.timeline && (
                        <p>
                          <span className="font-medium text-foreground">
                            Timeline:{" "}
                          </span>
                          {inq.timeline}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-dark-text border-t pt-3">
                      {inq.description}
                    </p>

                    {inq.replies?.length > 0 && (
                      <div className="border-t pt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {inq.replies.length}{" "}
                          {inq.replies.length === 1 ? "reply" : "replies"}
                        </p>
                        {inq.replies.map((reply, i) => (
                          <div
                            key={i}
                            className="rounded-md bg-muted px-3 py-2 text-sm"
                          >
                            {reply.body}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
