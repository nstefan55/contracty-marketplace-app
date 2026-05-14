"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGoogle from "@/components/AuthGoogle";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/onboarding/role");
  }

  return (
    <section className="min-h-screen bg-background-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-110 bg-white rounded-2xl p-10 flex flex-col gap-6">
        <div className="flex justify-center">
          <Image
            src="/images/logo/contracty-logo.png"
            alt="Contracty logo"
            width={80}
            height={80}
          />
        </div>

        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-[28px] font-bold text-dark-text leading-tight">
            Create your account
          </h1>
          <p className="text-[15px] text-gray-text">
            Join thousands of homeowners and contractors.
          </p>
        </div>

        <AuthGoogle />

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[13px] text-[#94a3b8]">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-[13px] font-semibold text-mid-text"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-11 rounded-lg border border-border px-4 text-[14px] text-dark-text placeholder:text-[#94a3b8] outline-none focus:border-dark-text transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[13px] font-semibold text-mid-text"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-11 rounded-lg border border-border px-4 text-[14px] text-dark-text placeholder:text-[#94a3b8] outline-none focus:border-dark-text transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-mid-text"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-11 rounded-lg border border-border px-4 text-[14px] text-dark-text placeholder:text-[#94a3b8] outline-none focus:border-dark-text transition-colors"
            />
          </div>

          {error && (
            <p className="text-[13px] text-error text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-dark-text text-white text-[15px] font-semibold rounded-lg hover:bg-dark-text/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-[13px] text-gray-text text-center">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-dark-text hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
