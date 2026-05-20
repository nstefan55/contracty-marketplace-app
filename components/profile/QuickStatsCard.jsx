export default function QuickStatsCard({ viewCount, bookmarkCount }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-3.5">
      <h3 className="text-base font-bold text-slate-800">Quick Stats</h3>

      <StatRow label="Profile views" value={`${viewCount ?? 0} total`} />
      <StatRow label="Response time" value="Usually within a day" />
      <StatRow
        label="Bookmarks"
        value={`${bookmarkCount} people are currently interested`}
      />
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}
