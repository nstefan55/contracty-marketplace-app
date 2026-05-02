import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedContractors from "@/components/FeaturedContractors";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturedContractors />
      <Footer />
    </main>
  );
}
