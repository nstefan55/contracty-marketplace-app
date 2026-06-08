"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { markInquiryAsRead } from "@/app/actions/Inquiry/markInquiryAsRead";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_VARIANT = {
  new: "default",
  read: "secondary",
  replied: "outline",
  closed: "secondary",
};

function InquiryItem({ inq, session, isContractor }) {
  const id = inq._id.toString();
  const [status, setStatus] = useState(inq.status);
  const [pending, setPending] = useState(false);

  const date = new Date(inq.createdAt).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const contactName = isContractor
    ? (inq.sender?.name ?? "User")
    : (inq.contractor?.name ?? "User");

  const sentToEmail = inq.recipient?.email ?? inq.contractor?.email;
  const senderEmail = inq.sender?.email;
  const isSelfSender = session.user.id === inq.sender?._id.toString();
  const isRecipient = session.user.id === inq.recipient?._id.toString();

  async function handleToggleRead() {
    if (pending) return;
    const previous = status;
    const optimistic = status === "read" ? "new" : "read";
    setStatus(optimistic);
    setPending(true);
    try {
      const next = await markInquiryAsRead(id);
      setStatus(next);
      toast.success(`Marked as ${next}`);
    } catch (err) {
      setStatus(previous);
      toast.error("Failed to update status");
    } finally {
      setPending(false);
    }
  }

  function handleDelete() {}

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg text-dark-text">{contactName}</p>
            {!isSelfSender && sentToEmail && (
              <div className="flex items-center gap-2">
                <p className="text-md text-dark-text">Reply to:</p>
                <Link
                  href={`mailto:${senderEmail}`}
                  className="text-md text-blue-500"
                >
                  {senderEmail}
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-lg text-muted-foreground">{date}</span>
            <Badge variant={STATUS_VARIANT[status] ?? "new"}>{status}</Badge>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-0.5">
          <p className="text-lg text-muted-foreground">
            <span className="font-medium text-foreground">Project: </span>
            {inq.projectType}
          </p>
          {inq.budget && (
            <p className="text-lg text-muted-foreground">
              <span className="font-medium text-foreground">Budget: </span>
              {inq.budget}
            </p>
          )}
          {inq.timeline && (
            <p className="text-lg text-muted-foreground">
              <span className="text-lg text-foreground">Timeline: </span>
              {inq.timeline}
            </p>
          )}
        </div>

        <p className="text-lg text-dark-text border-t pt-3">
          {inq.description}
        </p>

        {inq.replies?.length > 0 && (
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {inq.replies.length}{" "}
              {inq.replies.length === 1 ? "reply" : "replies"}
            </p>
            {inq.replies.map((reply, i) => (
              <div key={i} className="rounded-md bg-muted px-3 py-2 text-sm">
                {reply.body}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardContent className="pt-0 gap-2 flex">
        {isRecipient && (
          <button
            className="text-sm text-white rounded-2xl font-bold bg-orange-500 hover:bg-orange-500/80 p-2 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleToggleRead}
            disabled={pending}
          >
            {pending
              ? "Updating…"
              : status === "read"
                ? "Mark as unread"
                : "Mark as read"}
          </button>
        )}
        <button
          className="text-sm text-white rounded-2xl font-bold bg-red-500 hover:bg-red-500/80 p-2 mt-2 cursor-pointer"
          onClick={handleDelete}
        >
          Delete
        </button>
      </CardContent>
    </Card>
  );
}

export default function InquiryCard({ inquiries, session, isContractor }) {
  if (inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <MessageSquare size={32} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inq) => (
        <InquiryItem
          key={inq._id.toString()}
          inq={inq}
          session={session}
          isContractor={isContractor}
        />
      ))}
    </div>
  );
}
