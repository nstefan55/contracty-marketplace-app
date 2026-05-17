import { ImageIcon } from "lucide-react";

const PortfolioSection = ({ items }) => {
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
      <h2 className="text-md font-bold text-slate-800 mb-4">Recent Work</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <>
            <div
              key={item._id}
              className="rounded-xl overflow-hidden border border-slate-200"
            >
              {/* TODO - Add image rendering logic */}
              {/* PLACEHOLDER FOR IMAGES */}
              {item.images?.[0] ? (
                // When images are uploaded, render them here:
                // <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                <span className="text-sm text-slate-400">
                  Photo Coming Soon
                </span>
              ) : (
                <ImageIcon size={24} className="mx-auto text-slate-300 my-10" />
              )}
            </div>
            <div className="p-4 space-y-1">
              <p className="text-sm font-semibold text-slate-800">
                {item.title}
              </p>
            </div>
          </>
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection;
