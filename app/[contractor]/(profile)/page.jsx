import { notFound } from "next/navigation";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Portfolio from "@/models/Portfolio";
import Review from "@/models/Review";
import User from "@/models/User";
import { auth } from "@/app/auth";

import ProfileHeader from "@/components/profile/ProfileHeader";
import PortfolioSection from "@/components/profile/PortfolioSection";
import ReviewSection from "@/components/profile/ReviewSection";
import CertificationsSection from "@/components/profile/CertificationsSection";
import InquiryFormCard from "@/components/profile/InquiryFormCard";
import ServiceAreaCard from "@/components/profile/ServiceAreaCard";
import QuickStatsCard from "@/components/profile/QuickStatsCard";

import WriteReviewsCard from "@/components/profile/WriteReviewsCard";

import ShareButtons from "@/components/profile/ShareButtons";

import convertToSerializableObject from "@/app/utils/convertToObject";

export default async function ContractorProfilePage({ params }) {
  await connectDB();
  //passing contractor slug from current session user
  const { contractor: slug } = await params;

  //Getting current user
  const session = await auth();

  let contractorDoc = null;

  try {
    contractorDoc = await Contractor.findOne({ slug }).lean();
  } catch (error) {
    console.log(error);
  }

  const contractor = convertToSerializableObject(contractorDoc);

  //Find contractor with slug in the database

  if (!contractor) notFound();

  const isOwnProfile = session?.user?.id === contractor.owner?.toString();

  const [portfolioDoc, reviewsDoc, bookmarkCountDoc, isBookmarkedDoc] =
    await Promise.all([
      Portfolio.find({ contractor: contractor._id })
        .sort({ completedAt: -1 })
        .lean(),
      Review.find({ contractor: contractor._id })
        .populate("user", "name image")
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments({ bookmarks: contractor._id }),

      session
        ? User.exists({ _id: session.user.id, bookmarks: contractor._id })
        : Promise.resolve(false),
    ]);

  const portfolio = convertToSerializableObject(portfolioDoc);
  const reviews = convertToSerializableObject(reviewsDoc);
  const bookmarkCount = convertToSerializableObject(bookmarkCountDoc);
  const isBookmarked = convertToSerializableObject(isBookmarkedDoc);

  //Increment view count -fire and forget, don't wait
  Contractor.updateOne(
    { _id: contractor._id },
    { $inc: { viewCount: 1 } },
  ).exec();

  return (
    <>
      <ProfileHeader
        contractor={contractor}
        bookmarkCount={bookmarkCount}
        isBookmarked={!!isBookmarked}
        session={session}
        isOwnProfile={isOwnProfile}
      />
      <main className="max-w-7xl mx-auto px-12 py-8 flex gap-8 items-start">
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          <PortfolioSection items={portfolio} />
          <ReviewSection
            reviews={reviews}
            totalCount={contractor.reviewCount}
          />
          <CertificationsSection
            certifications={contractor.certifications}
            yearsExperience={contractor.yearsExperience}
          />
        </div>
        {/* Right Column */}
        <div className="shrink-0 flex flex-col gap-6 w-95">
          <InquiryFormCard
            contractorSlug={slug}
            contractorName={contractor.name}
            isLoggedIn={!!session}
          />
          <ShareButtons contractorId={contractor._id} />
          <ServiceAreaCard serviceArea={contractor.serviceArea} />
          <WriteReviewsCard
            contractorId={contractor._id}
            isLoggedIn={!!session}
            isOwnProfile={isOwnProfile}
          />
          <QuickStatsCard
            viewCount={contractor.viewCount}
            bookmarkCount={bookmarkCount}
            isBookmarked={isBookmarked}
          />
        </div>
      </main>
    </>
  );
}
