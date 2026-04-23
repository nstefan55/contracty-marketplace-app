import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "CCM - Construction Contractor Marketplace",
  description: "Find verified local contractors for any project.",
};

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  display: swap,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${notoSans.className} ${raleway.className}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
