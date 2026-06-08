import { Noto_Sans, Raleway, Source_Sans_3, Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import { auth } from "@/app/auth";
import "./globals.css";
import { cn } from "@/lib/utils";
import { InquiryProvider } from "@/app/context/InquiryContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });
const raleway = Raleway({ subsets: ["latin"], display: "swap" });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Contracty - Find Local Contractors",
  description: "Find verified local contractors for any project.",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <AuthProvider session={session}>
      <InquiryProvider>
        <html
          lang="en"
          className={cn(
            notoSans.className,
            raleway.className,
            sourceSans3.className,
            "font-sans",
            geist.variable,
          )}
        >
          <body>
            {children}
            <Toaster position="top-center" />
          </body>
        </html>
      </InquiryProvider>
    </AuthProvider>
  );
}
