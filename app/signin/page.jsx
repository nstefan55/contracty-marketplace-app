import Image from "next/image";
import Link from "next/link";
import AuthGoogle from "@/components/AuthGoogle";
import { signIn } from "@/utils/auth";

const SignInPage = () => {
  async function credentialsSignIn(formData) {
    "use server";
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  }

  return (
    <section className="min-h-screen bg-background-light flex items-center justify-center px-4">
      <div className="w-full max-w-110 bg-white rounded-2xl p-10 flex flex-col gap-6">

        <div className="flex justify-center">
          <Image
            src="/images/logo/contracty-logo.png"
            alt="CCM logo"
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

        <AuthGoogle />

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[13px] text-[#94a3b8]">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form action={credentialsSignIn} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-semibold text-mid-text">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-11 rounded-lg border border-border px-4 text-[14px] text-dark-text placeholder:text-[#94a3b8] outline-none focus:border-dark-text transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[13px] font-semibold text-mid-text">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="h-11 rounded-lg border border-border px-4 text-[14px] text-dark-text placeholder:text-[#94a3b8] outline-none focus:border-dark-text transition-colors"
            />
          </div>

          <button
            type="submit"
            className="h-12 w-full bg-dark-text text-white text-[15px] font-semibold rounded-lg hover:bg-dark-text/90 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <p className="text-[13px] text-gray-text text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-dark-text hover:underline">
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
