import { Noto_Sans, Raleway, Source_Sans_3, Geist } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/app/auth";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <AuthProvider session={session}>
      <html
        lang="en"
        className={cn(notoSans.className, raleway.className, sourceSans3.className, "font-sans", geist.variable)}
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
