"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto flex max-w-7xl flex-col px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo/contracty-logo.png"
              alt="Contracty logo"
              width={80}
              height={80}
              className="rounded object-cover"
              priority
            />
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="flex h-4 w-5 flex-col justify-between">
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
            </span>
          </button>
        </div>

        <div
          className={`mt-4 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:gap-6 ${
            isMenuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <Link
            href="/"
            className="rounded-md px-1 py-2 text-sm font-medium text-slate-700 transition hover:text-orange-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/browse"
            className="rounded-md px-1 py-2 text-sm font-medium text-slate-700 transition hover:text-orange-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse
          </Link>
          <Link
            href="/signin"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 md:ml-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
