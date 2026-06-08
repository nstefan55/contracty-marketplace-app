import { InquiryItem } from "@/components/InquiryItem";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
