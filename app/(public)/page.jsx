import HeroSection from "@/components/HeroSection";
import FeaturedContractors from "@/components/FeaturedContractors";
import SimpleProcessSteps from "@/components/SimpleProcessSteps";
import Testimonials from "@/components/Testimonials";
import HomepageCTA from "@/components/HomepageCTA";

//TODO - Code Cleanup of entire codebase, search and remove rendundent code, comments, and console logs. Refactor where necessary for better readability and maintainability.

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedContractors />
      <SimpleProcessSteps />
      <Testimonials />
      <HomepageCTA />
    </main>
  );
}
