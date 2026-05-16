import Link from "next/link";
import { UserPen, Images, ExternalLink } from "lucide-react";

const QuickActions = ({ slug }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        <Link
          href={`/${slug}/dashboard/edit-profile`}
          className="flex items-center gap-4 px-6 py-5 hover:bg-orange-50 transition-colors group"
        >
          <div className="shrink-0 rounded-xl bg-orange-100 p-3">
            <UserPen size={18} className="text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-orange-700 transition-colors">
              Edit Profile
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your info &amp; trade
            </p>
          </div>
        </Link>

        <Link
          href={`/${slug}/dashboard/portfolio`}
          className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors group"
        >
          <div className="shrink-0 rounded-xl bg-slate-100 p-3">
            <Images size={18} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
              Upload Portfolio
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Showcase completed projects
            </p>
          </div>
        </Link>

        <Link
          href={`/${slug}`}
          target="_blank"
          className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors group"
        >
          <div className="shrink-0 rounded-xl bg-slate-100 p-3">
            <ExternalLink size={18} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
              Public Profile
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              See how clients see you
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
