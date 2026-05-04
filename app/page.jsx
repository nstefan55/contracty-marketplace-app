import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedContractors from "@/components/FeaturedContractors";
import SimpleProcessSteps from "@/components/SimpleProcessSteps";
import Testimonials from "@/components/Testimonials";
import HomepageCTA from "@/components/HomepageCTA";

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
