import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";

import FeaturedContractorCard from "./FeaturedContractorCard";

const FeaturedContractors = async () => {
  await connectDB();

  const contractors = await Contractor.find({
    featured: true,
  }).lean();

  return contractors.length > 0 ? (
    <section className="bg-blue-50 px-4 py-6 pb-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
          Featured This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contractors.map((contractor) => (
            <FeaturedContractorCard
              key={contractor._id}
              contractor={contractor}
            />
          ))}
        </div>
      </div>
    </section>
  ) : null;
};

export default FeaturedContractors;
