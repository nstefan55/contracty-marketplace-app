import Link from "next/link";
import { ShieldCheck, Users, Sparkles } from "lucide-react";
import { auth } from "@/app/auth";

export const metadata = {
  title: "About | Contracty",
  description:
    "Contracty connects homeowners with trusted local contractors — verified profiles, real reviews, no middlemen.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified contractors",
    body: "Every profile is checked so you can hire with confidence — credentials, reviews and work history in one place.",
  },
  {
    icon: Users,
    title: "Built for both sides",
    body: "Homeowners find the right trade in minutes. Contractors grow their business with quality leads — no chasing.",
  },
  {
    icon: Sparkles,
    title: "Simple by design",
    body: "Search, compare, message. No noisy ads, no hidden fees, no clutter — just the tools you actually need.",
  },
];

const AboutPage = async () => {
  const session = await auth();

  return (
    <main>
      {/* Hero */}
      <section className="w-full bg-white px-4 pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#F97316]">
            About Contracty
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-[#071426] leading-tight">
            Hiring a contractor shouldn&apos;t feel like a gamble.
          </h1>
          <p className="mt-5 text-gray-500 text-base sm:text-lg">
            We&apos;re building the simplest way to find a trusted local
            tradesperson — verified, reviewed, and ready to quote.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="w-full bg-white px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071525]">
            Our mission
          </h2>
          <div className="mt-4 space-y-4 text-gray-500 leading-relaxed">
            <p>
              Finding a reliable contractor is still one of the most stressful
              parts of owning a home. Word-of-mouth is hit-or-miss, marketplaces
              are full of noise, and the people doing great work often get
              buried under those who shout the loudest.
            </p>
            <p>
              Contracty exists to fix that. We give homeowners a clear,
              verified picture of who they&apos;re hiring — and we give skilled
              tradespeople a fair shot at being seen for the quality of their
              work.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full bg-white px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#071525] text-center">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center w-65 md:w-full mx-auto"
              >
                <div className="h-12 w-12 shrink-0 rounded-full my-2 flex items-center justify-center bg-primary-light text-primary-dark">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-[#071525]">{title}</h3>
                <p className="text-sm mt-2 text-gray-500 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E293B] py-24 px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-5">
          <h2 className="text-4xl font-bold text-white text-center">
            Ready to get started?
          </h2>
          <p className="text-[#94A3B8] text-center max-w-xl">
            Browse trusted local contractors or join Contracty as a
            tradesperson.
          </p>
          <Link
            href="/contractors"
            className="flex items-center justify-center w-65.5 h-12 bg-[#F97316] hover:bg-[#EA580C] text-white text-base font-semibold rounded-lg transition-colors"
          >
            Browse All Contractors →
          </Link>
          {!session && (
            <p className="text-[#94A3B8] text-sm">
              <Link
                href="/signup"
                className="underline hover:text-white transition-colors"
              >
                sign up as a contractor
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
