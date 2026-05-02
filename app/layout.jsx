import { Noto_Sans, Raleway, Source_Sans_3 } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "Contracty - Find Local Contractors",
  description: "Find verified local contractors for any project.",
};

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html
        lang="en"
        className={`${notoSans.className} ${raleway.className} ${sourceSans3.className}`}
      >
        <body>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
