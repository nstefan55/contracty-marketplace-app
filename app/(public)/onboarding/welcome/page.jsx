"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { setupContractorProfile } from "@/app/actions/Contractor/setupContractorProfile";

const content = {
  homeowner: {
    headline: "Your home is in good hands",
    body: "Browse vetted local contractors, read real reviews, and hire with confidence. Your next project starts here.",
    cta: "Find contractors",
  },
  contractor: {
    headline: "Ready to grow your business",
    body: "Connect with homeowners who need your skills, showcase your work, and build lasting client relationships.",
    cta: "Set up your profile",
  },
};

export default function WelcomePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  async function handleGetStarted() {
    setIsLoading(true);
    const updated = await update();
    const role = updated?.user?.role ?? session?.user?.role;
    if (role === "contractor") {
      const { slug } = await setupContractorProfile();
      // Middleware reads the JWT cookie, not the DB — refresh it after setup so
      // it reflects needsOnboarding: false before the navigation request arrives.
      await update();
      router.push(`/${slug}/dashboard/edit-profile`);
    } else if (role === "homeowner") {
      router.push("/contractors");
    } else {
      router.push("/");
    }
  }

  const role = searchParams.get("role") || session?.user?.role;
  const copy = content[role] ?? content.homeowner;

  if (isLoading) {
    return (
      <section className="min-h-screen bg-background-light flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-10 flex flex-col items-center gap-6 text-center">
          <Image
            src="/images/logo/contracty-logo.png"
            alt="Contracty"
            width={72}
            height={72}
          />
          <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-semibold text-dark-text">
              Setting up your profile…
            </p>
            <p className="text-[13px] text-gray-text">This will only take a moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-10 flex flex-col items-center gap-8 text-center">
        <Image
          src="/images/logo/contracty-logo.png"
          alt="Contracty"
          width={72}
          height={72}
        />

        <div className="flex flex-col gap-4">
          <h1 className="text-[28px] font-bold text-dark-text leading-tight">
            {copy.headline}
          </h1>
          <p className="text-[15px] text-gray-text leading-relaxed">
            {copy.body}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleGetStarted}
            className="h-12 w-full bg-primary text-white text-[15px] font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
          >
            {copy.cta} →
          </button>
          <p className="text-[12px] text-[#94a3b8]">Welcome to Contracty</p>
        </div>
      </div>
    </section>
  );
}
