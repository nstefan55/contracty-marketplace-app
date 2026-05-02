import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedContractors from "@/components/FeaturedContractors";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedContractors />
    </main>
  );
}
