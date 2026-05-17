import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContractorProfileLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}