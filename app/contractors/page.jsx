import ContractorCard from "@/components/ContractorCard";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Pagination from "@/components/Pagination";
import Portfolio from "@/models/Portfolio";
import SidebarFilter from "@/components/SidebarFilter";
import contractorFilterQuery from "@/lib/contractorFilterQuery";
import { SearchX } from "lucide-react";

const ContractorsPage = async ({ searchParams }) => {
  await connectDB();

  const sp = await searchParams;

  const { page = 1, pageSize = 9 } = sp;

  let query = contractorFilterQuery(sp);

  const skip = (page - 1) * pageSize;

  const totalItems = await Contractor.countDocuments(query);

  const contractors = await Contractor.find(query)
    .skip(skip)
    .limit(Number(pageSize));

  const showPagination = totalItems > pageSize;

  const contractorIds = contractors.map((c) => c._id);

  const portfolios = await Portfolio.find({
    contractor: { $in: contractorIds },
  }).lean();

  const portfolioMap = portfolios.reduce((acc, portfolio) => {
    const contractorId = portfolio.contractor.toString();
    if (!acc[contractorId]) {
      acc[contractorId] = [];
    }
    acc[contractorId].push(portfolio);
    return acc;
  }, {});

  return (
    <section className="px-4 py-6">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row gap-6 px-25">
        <aside className="md:w-80 md:shrink-0">
          <SidebarFilter />
        </aside>
        <div className="flex-1 min-w-0">
          {/* // TODO - Add Penpot design for "No results found" state and style */}
          {contractors.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-20">
              <SearchX className="h-12 w-12 text-orange-500" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                No Contractors found or match your filters
              </h1>
              <h1 className="text-md font-bold text-orange-500">
                Try adjusting your filters or search criteria to find the right
                contractor for your needs.
              </h1>
            </div>
          ) : (
            <>
              <p>{`${totalItems} Contractors Found`}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {contractors.map((contractor) => (
                  <ContractorCard
                    key={contractor._id}
                    contractor={contractor}
                    profileImages={
                      portfolioMap[contractor._id.toString()]?.[0]?.images || []
                    }
                  />
                ))}
              </div>
            </>
          )}
          {showPagination && (
            <Pagination
              page={parseInt(page)}
              pageSize={parseInt(pageSize)}
              totalItems={totalItems}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ContractorsPage;
