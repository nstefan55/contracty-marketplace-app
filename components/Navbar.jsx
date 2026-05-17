"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileImage = session?.user?.image;
  const contractorSlug = session?.user?.contractorSlug;

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
          {session && session.user.role === "homeowner" && (
            <Link
              href="/"
              className="rounded-md px-1 py-2 text-sm font-medium text-slate-700 transition hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          )}
          <Link
            href="/contractors"
            className="rounded-md px-1 py-2 text-sm font-medium text-slate-700 transition hover:text-orange-500"
            onClick={() => setIsMenuOpen(false)}
          >
            Find Contractors
          </Link>
          {session && session.user.role === "contractor" && (
            <Link
              href="/dashboard"
              className="rounded-md px-1 py-2 text-sm font-medium text-slate-700 transition hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {/* <!-- Right Side Menu (Logged Out) --> */}
          {!session && (
            <Link
              href="/signin"
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 md:ml-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
          {/* <!-- Logged in as CONTRACTOR --> */}
          {session && session.user.role === "contractor" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
              <Link href="/messages" className="relative group">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>
                {/* <UnreadMessageCount /> */}
              </Link>
              {/* <!-- Profile dropdown button --> */}
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen((open) => !open);
                    }}
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={profileImage || ""}
                      width={40}
                      height={40}
                      alt=""
                    />
                  </button>
                </div>

                {/* <!-- Profile dropdown --> */}
                {isProfileMenuOpen && (
                  <div
                    id="user-menu"
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    {session.user.role === "contractor" && (
                      <Link
                        href={
                          contractorSlug ? `/${contractorSlug}` : "/dashboard"
                        }
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-0"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        View Public Profile
                      </Link>
                    )}
                    {/* <Link
                      href="/projects/saved"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Saved Projects
                    </Link> */}
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* <!-- Logged in as USER --> */}
          {session && session.user.role === "homeowner" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
              <Link href="/messages" className="relative group">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>
                {/* <UnreadMessageCount /> */}
              </Link>
              {/* <!-- Profile dropdown button --> */}
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen((open) => !open);
                    }}
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={profileImage || ""}
                      width={40}
                      height={40}
                      alt=""
                    />
                  </button>
                </div>

                {/* <!-- Profile dropdown --> */}
                {isProfileMenuOpen && (
                  <div
                    id="user-menu"
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-0"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/contractors/saved"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Saved Contractors
                    </Link>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
