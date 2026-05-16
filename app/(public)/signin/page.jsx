"use client";

import Image from "next/image";
import Link from "next/link";
import AuthGoogle from "@/components/AuthGoogle";
import { credentialsSignIn } from "@/app/actions/credentialsSignIn";
import { useActionState, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { MoonLoaderSpinner } from "@/components/lib/Spinner";
import { signInSchema } from "@/lib/zod";

const initialState = {
  message: null,
  errors: {},
};

const SignInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [otpError, setOtpError] = useState("");
  const [otpPending, setOtpPending] = useState(false);
  const emailRef = useRef(null);
  const [state, formAction, isPending] = useActionState(
    credentialsSignIn,
    initialState,
  );

  const handleSendOTP = async () => {
    const email = emailRef.current?.value?.trim();
    if (!email) {
      setOtpError("Please enter your email address first.");
      return;
    }
    setOtpError("");
    setOtpPending(true);
    const res = await fetch("/api/auth/send-signin-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setOtpPending(false);
    if (!res.ok) {
      setOtpError(data.error);
      return;
    }
    router.push("/signin/verify");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});
    formAction(formData);
  };

  return (
    <section className="min-h-screen bg-background-light flex items-center justify-center px-4">
      <div className="w-full max-w-110 md:max-w-xl bg-white rounded-2xl p-10 md:p-14 flex flex-col gap-6">
        <div className="flex justify-center">
          <Image
            src="/images/logo/contracty-logo.png"
            alt="Contracty logo"
            width={80}
            height={80}
          />
        </div>

        <h1 className="text-[28px] font-bold text-dark-text text-center leading-tight">
          Sign in to Contracty
        </h1>

        <p className="text-[15px] text-gray-text text-center">
          Welcome back. Sign in to find trusted local contractors.
        </p>

        {/* // Google Sign-In */}
        <AuthGoogle />

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[13px] text-[#94a3b8]">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[13px] font-semibold text-mid-text"
            >
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-lg border border-border px-4 text-[14px] text-dark-text placeholder:text-[#94a3b8] outline-none focus:border-dark-text transition-colors"
            />
            {(fieldErrors.email ?? state.errors?.email)?.map((error) => (
              <p key={error} className="text-[13px] text-red-500 text-center">
                {error}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-mid-text"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 w-full rounded-lg border border-border px-4 pr-11 text-[14px] text-dark-text placeholder:text-[#94a3b8] outline-none focus:border-dark-text transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-dark-text transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {(fieldErrors.password ?? state.errors?.password)?.map((error) => (
              <p key={error} className="text-[13px] text-red-500 text-center ">
                {error}
              </p>
            ))}
          </div>

          {state.message && (
            <p className="text-amber-600 font-medium mx-auto">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            href="/api"
            className="h-12 w-full bg-dark-text text-white text-[15px] font-semibold rounded-lg hover:bg-dark-text/90 transition-colors cursor-pointer"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                Loading...
                <MoonLoaderSpinner loading={true} size={30} className="ml-2" />
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[13px] text-[#94a3b8]">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            type="button"
            onClick={handleSendOTP}
            disabled={otpPending}
            className="h-12 w-full border border-border text-dark-text text-[15px] font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {otpPending ? "Sending code…" : "Sign in with email code"}
          </button>

          {otpError && (
            <p className="text-[13px] text-red-500 text-center">{otpError}</p>
          )}
        </form>

        <p className="text-[13px] text-gray-text text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-dark-text hover:underline"
          >
            Sign up
          </Link>
        </p>

        <p className="text-[11px] text-[#94a3b8] text-center">
          We never store your password
        </p>
      </div>
    </section>
  );
};

export default SignInPage;
