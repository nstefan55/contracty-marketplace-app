import { ImageIcon } from "lucide-react";

export default function PortfolioSection({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <section>
        <h2 className="text-[22px] font-bold text-slate-800 mb-4">
          Recent Work
        </h2>
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-400">No portfolio items yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-[22px] font-bold text-slate-800 mb-4">Recent Work</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden"
          >
            {/* Photo slot — replace this div with <Image> when upload is ready */}
            <div className="w-full aspect-video bg-slate-100 flex items-center justify-center">
              {item.images?.[0] ? (
                // When images are uploaded, render them here:
                // <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                <span className="text-xs text-slate-400">
                  Photo coming soon
                </span>
              ) : (
                <ImageIcon size={24} className="text-slate-300" />
              )}
            </div>
            <div className="p-4 space-y-1">
              <p className="text-sm font-semibold text-slate-800">
                {item.title}
              </p>
              {item.projectType && (
                <p className="text-xs text-slate-500">{item.projectType}</p>
              )}
              {item.description && (
                <p className="text-xs text-slate-500 line-clamp-2">
                  {item.description}
                </p>
              )}
              {item.completedAt && (
                <p className="text-xs text-slate-400">
                  Completed{" "}
                  {new Date(item.completedAt).toLocaleDateString("en-IE", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
