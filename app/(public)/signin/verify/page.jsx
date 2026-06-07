"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithOTP } from "@/app/actions/auth-actions";

export default function SignInVerifyPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendState, setResendState] = useState("idle"); // idle | sending | sent
  const inputsRef = useRef([]);

  const otp = digits.join("");

  function handleDigitChange(index, value) {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);

    if (cleaned && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputsRef.current[5]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.length !== 6) return;

    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/verify-signin-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error);
      if (data.lockout) setDigits(["", "", "", "", "", ""]);
      return;
    }

    const result = await signInWithOTP(data.email);
    if (result?.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    router.refresh();
    router.push("/");
  }

  async function handleResend() {
    setResendState("sending");
    setError("");

    const res = await fetch("/api/auth/resend-signin-otp", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setResendState("idle");
    } else {
      setResendState("sent");
      setTimeout(() => setResendState("idle"), 30000);
    }
  }

  return (
    <section className="min-h-screen bg-background-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-10 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/images/logo/contracty-logo.png"
            alt="Contracty"
            width={64}
            height={64}
          />
          <h1 className="text-[26px] font-bold text-dark-text">
            Check your email
          </h1>
          <p className="text-[15px] text-gray-text">
            We sent a 6-digit code to your email address. Enter it below to
            sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-[22px] font-bold text-dark-text border-2 border-border rounded-xl outline-none focus:border-dark-text transition-colors"
              />
            ))}
          </div>

          {error && (
            <p className="text-[13px] text-red-500 text-center -mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="h-12 w-full bg-dark-text text-white text-[15px] font-semibold rounded-lg hover:bg-dark-text/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-[13px] text-gray-text text-center">
          Didn&apos;t receive a code?{" "}
          {resendState === "sent" ? (
            <span className="text-green-600 font-semibold">Code sent!</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendState === "sending"}
              className="font-semibold text-dark-text hover:underline disabled:opacity-60 cursor-pointer"
            >
              {resendState === "sending" ? "Sending…" : "Resend code"}
            </button>
          )}
        </p>
      </div>
    </section>
  );
}
