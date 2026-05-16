import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children, slug }) {
  return (
    <>
      <Navbar slug={slug} />
      {children}
      <Footer />
    </>
  );
}
