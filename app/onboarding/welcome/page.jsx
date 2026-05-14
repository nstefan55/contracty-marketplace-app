"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  useEffect(() => {
    // Refresh session in the background so the JWT reflects the new role
    // for future server-component reads. The middleware bypass is handled
    // by the onboarding_done cookie set in /api/onboarding/set-role.
    update();
  }, []);

  function handleGetStarted() {
    router.push("/");
  }

  const role = session?.user?.role;
  const copy = content[role] ?? content.homeowner;

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
