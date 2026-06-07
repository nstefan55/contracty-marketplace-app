import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Review from "@/models/Review";
import TestimonialsCard from "./TestimonialsCard";

const Testimonials = async () => {
  await connectDB();

  const featuredIds = await Contractor.distinct("_id", { featured: true });

  const allReviews = await Review.find({
    verified: true,
    contractor: { $in: featuredIds },
  })
    .populate("user", "name image")
    .lean();

  const validReviews = allReviews
    .filter((r) => r.user !== null)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return validReviews.length > 0 ? (
    <section className="bg-white px-4 py-6 pb-16">
      <div className="w-full container-xl lg:container m-auto">
        <h2 className="text-3xl font-extrabold text-[#071525] text-center my-4 ">
          Trusted by Homeowners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto ">
          {validReviews.map((review) => (
            <TestimonialsCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </section>
  ) : null;
};

export default Testimonials;
