import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Portfolio from "@/models/Portfolio";

import FeaturedContractorCard from "@/components/FeaturedContractorCard";

const FeaturedContractors = async () => {
  await connectDB();

  const allFeatured = await Contractor.find({ featured: true }).lean();
  const contractors = allFeatured.sort(() => 0.5 - Math.random()).slice(0, 3);

  const contractorIds = contractors.map((c) => c._id);

  // Fetch portfolios for these contractors
  const portfolios = await Portfolio.find({
    contractor: { $in: contractorIds },
  }).lean();

  // Create a map of contractor ID to their portfolios
  const portfolioMap = portfolios.reduce((acc, portfolio) => {
    const contractorId = portfolio.contractor.toString();
    if (!acc[contractorId]) {
      acc[contractorId] = [];
    }
    acc[contractorId].push(portfolio);
    return acc;
  }, {});

  return contractors.length > 0 ? (
    <section className="bg-white px-4 py-4 pb-8">
      <div className="w-full container-xl lg:container m-auto">
        <h2 className="text-3xl font-extrabold text-[#071525] text-center my-4 ">
          Featured This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
          {contractors.map((contractor) => (
            <FeaturedContractorCard
              key={contractor._id}
              contractor={contractor}
              profileImages={
                portfolioMap[contractor._id.toString()]?.[0]?.images || []
              }
            />
          ))}
        </div>
      </div>
    </section>
  ) : null;
};

export default FeaturedContractors;
