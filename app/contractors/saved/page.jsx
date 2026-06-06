import { redirect } from "next/navigation";

import connectDB from "@/config/database";
import User from "@/models/User";
import Contractor from "@/models/Contractor";
import Portfolio from "@/models/Portfolio";
import ContractorCard from "@/components/ContractorCard";
import Pagination from "@/components/Pagination";

import { auth } from "@/app/auth";

export default async function SavedContractorsPage({ searchParams }) {
  const session = await auth();
  if (!session) redirect("/signin");

  await connectDB();

  const sp = await searchParams;
  const { page = 1, pageSize = 9 } = sp;

  const user = await User.findById(session.user.id).select("bookmarks").lean();
  const bookmarkIds = user?.bookmarks ?? [];
  const totalItems = bookmarkIds.length;

  const skip = (Number(page) - 1) * Number(pageSize);

  const bookmarkedContractors =
    totalItems > 0
      ? await Contractor.find({ _id: { $in: bookmarkIds } })
          .skip(skip)
          .limit(Number(pageSize))
          .lean()
      : [];

  const contractorIds = bookmarkedContractors.map((c) => c._id);
  const portfolios = await Portfolio.find({
    contractor: { $in: contractorIds },
  }).lean();

  const portfolioMap = portfolios.reduce((acc, portfolio) => {
    const id = portfolio.contractor.toString();
    if (!acc[id]) acc[id] = [];
    acc[id].push(portfolio);
    return acc;
  }, {});

  const showPagination = totalItems > pageSize;

  return (
    <main className="container mx-auto max-w-8xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Saved Contractors ({totalItems})
      </h1>

      {totalItems === 0 ? (
        <p className="text-slate-600">You haven&apos;t saved any contractors yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedContractors.map((contractor) => (
              <ContractorCard
                key={contractor._id}
                contractor={contractor}
                profileImages={
                  portfolioMap[contractor._id.toString()]?.[0]?.images || []
                }
              />
            ))}
          </div>

          {showPagination && (
            <Pagination
              page={parseInt(page)}
              pageSize={parseInt(pageSize)}
              totalItems={totalItems}
            />
          )}
        </>
      )}
    </main>
  );
}
