import Link from "next/link";
import { MessageSquare } from "lucide-react";

const RecentMessages = ({ recentInquiries = [] }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">
          Recent Messages
        </h2>
        <Link
          href="/messages"
          className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
        >
          View all →
        </Link>
      </div>

      {recentInquiries.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <MessageSquare size={24} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-400">No messages yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {recentInquiries.map((inq) => {
            const id = inq._id.toString();
            const senderName = inq.sender?.name ?? "Unknown";
            const date = new Date(inq.createdAt).toLocaleDateString("en-IE", {
              day: "numeric",
              month: "short",
            });
            return (
              <li
                key={id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {senderName}
                  </p>
                  <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                    {inq.projectType} · {inq.description.slice(0, 70)}…
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-slate-400">{date}</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                      STATUS_STYLES[inq.status] ?? STATUS_STYLES.read
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentMessages;
