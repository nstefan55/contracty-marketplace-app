import Link from "next/link";

const HomepageCTA = () => {
  return (
    <section className="bg-[#1E293B] py-16 px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-5">
        <h2 className="text-4xl font-bold text-white text-center">
          Ready to find your contractor?
        </h2>

        <Link
          href="/contractors"
          className="flex items-center justify-center w-65.5 h-12 bg-[#F97316] hover:bg-[#EA580C] text-white text-base font-semibold rounded-lg transition-colors"
        >
          Browse All Contractors →
        </Link>

        <p className="text-[#94A3B8] text-sm align-middle">
          Or{" "}
          //TODO - Change the link to the contractor registration page once it's implemented
          <Link
            href="/register?role=contractor"
            className="underline hover:text-white transition-colors"
          >
            sign up as a contractor
          </Link>
        </p>
      </div>
    </section>
  );
};

export default HomepageCTA;
