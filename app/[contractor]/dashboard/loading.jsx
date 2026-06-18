export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-5xl animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-56 bg-slate-200 rounded" />
        <div className="h-4 w-72 bg-slate-100 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl" />
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-lg" />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-slate-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
