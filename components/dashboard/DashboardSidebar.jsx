"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPen,
  Images,
  MessageSquare,
  Settings,
  Menu,
  X,
  SquareArrowRightExit,
  LogOut,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

import { signOut } from "next-auth/react";

const navItems = (slug) => [
  { label: "Dashboard", href: `/${slug}/dashboard`, icon: LayoutDashboard },
  {
    label: "Edit Profile",
    href: `/${slug}/dashboard/edit-profile`,
    icon: UserPen,
  },
  { label: "My Portfolio", href: `/${slug}/dashboard/portfolio`, icon: Images },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: `/${slug}/dashboard/settings`, icon: Settings },
  {
    label: "Exit Dashboard",
    href: "/",
    icon: SquareArrowRightExit,
  },
  {
    label: "Logout",
    href: "/",
    icon: LogOut,
    onClick: () => signOut({ callbackUrl: "/" }),
  },
];

export default function DashboardSidebar({ slug, unreadCount = 0 }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { data: session } = useSession();
  const profilePicture = session?.user?.image;

  const currentYear = new Date().getFullYear();

  const navLinks = (
    <nav className="flex flex-col gap-1 p-3 flex-1">
      {navItems(slug).map(({ label, href, icon: Icon, onClick }) => {
        const active =
          href === `/${slug}/dashboard`
            ? pathname === href
            : href !== "/" && pathname.startsWith(href);

        const commonClass = cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-orange-50 text-orange-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        );

        if (onClick) {
          return (
            <button
              key={label}
              onClick={() => {
                setOpen(false);
                onClick();
              }}
              className={commonClass}
            >
              <Icon
                size={17}
                className={active ? "text-orange-500" : "text-slate-400"}
              />
              <span>{label}</span>
            </button>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={commonClass}
          >
            <Icon
              size={17}
              className={active ? "text-orange-500" : "text-slate-400"}
            />
            <span>{label}</span>
            {label === "Messages" && unreadCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[11px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo/contracty-logo.png"
            alt="Contracty Logo"
            width={40}
            height={40}
            className="shrink-0"
          />
        </Link>
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Contractor Hub
        </p>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col min-h-screen transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-4 border-b border-slate-100">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="Profile Picture"
              width={40}
              height={40}
              className="rounded-full shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
          )}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 truncate">
            Contractor Hub
          </p>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
        {navLinks}
        <div className="flex items-center justify-center gap-3 px-4 py-5 mt-auto border-t border-slate-200">
          <Image
            src="/images/logo/contracty-logo.png"
            alt="Contracty Logo"
            width={48}
            height={48}
            className="shrink-0"
          />
          <p className="text-xs text-slate-500">&copy; {currentYear} Contracty.</p>
        </div>
      </aside>
    </>
  );
}
