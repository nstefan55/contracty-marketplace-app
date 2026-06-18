"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

const roles = [
  {
    id: "homeowner",
    label: "I'm a Homeowner",
    description: "Looking for trusted contractors for my home projects",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "contractor",
    label: "I'm a Contractor",
    description: "Looking to connect with homeowners who need my skills",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const { update } = useSession();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    if (!selected) return;
    setError("");
    setLoading(true);

    const res = await fetch("/api/onboarding/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selected }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    if (data.requiresOTP) {
      router.push("/onboarding/verify");
    } else {
      await update();
      router.push(`/onboarding/welcome?role=${selected}`);
    }
  }

  return (
    <section className="min-h-screen bg-background-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl p-10 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/images/logo/contracty-logo.png"
            alt="Contracty"
            width={64}
            height={64}
          />
          <h1 className="text-[26px] font-bold text-dark-text">
            How will you use Contracty?
          </h1>
          <p className="text-[15px] text-gray-text">
            Choose your role — you can always change it later in settings.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {roles.map((role) => {
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelected(role.id)}
                className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-dark-text bg-dark-text/3"
                    : "border-border hover:border-[#cbd5e1]"
                }`}
              >
                <span
                  className={`shrink-0 ${isSelected ? "text-dark-text" : "text-gray-text"}`}
                >
                  {role.icon}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-[16px] font-semibold ${isSelected ? "text-dark-text" : "text-mid-text"}`}
                  >
                    {role.label}
                  </span>
                  <span className="text-[13px] text-gray-text">
                    {role.description}
                  </span>
                </div>
                {isSelected && (
                  <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-dark-text flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-[13px] text-error text-center -mt-4">{error}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="h-12 w-full bg-dark-text text-white text-[15px] font-semibold rounded-lg hover:bg-dark-text/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Continue"}
        </button>
      </div>
    </section>
  );
}
