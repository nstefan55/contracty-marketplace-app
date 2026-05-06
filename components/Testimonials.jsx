import connectDB from "@/config/database";
import Review from "@/models/Review";
import TestimonialsCard from "./TestimonialsCard";
import User from "@/models/User";

const Testimonials = async () => {
  await connectDB();

  const reviews = await Review.find({ verified: true })
    .populate("user", "name profileImage")
    .lean();

  // Filter out reviews with null user references (orphaned data)
  const validReviews = reviews.filter((review) => review.user !== null);

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
