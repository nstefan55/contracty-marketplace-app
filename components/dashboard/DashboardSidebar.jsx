"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPen,
  Images,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = (slug) => [
  { label: "Dashboard", href: `/${slug}/dashboard`, icon: LayoutDashboard },
  { label: "Edit Profile", href: `/${slug}/dashboard/edit-profile`, icon: UserPen },
  { label: "My Portfolio", href: `/${slug}/dashboard/portfolio`, icon: Images },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: `/${slug}/dashboard/settings`, icon: Settings },
];

export default function DashboardSidebar({ slug, unreadCount = 0 }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col min-h-screen">
      <div className="px-5 py-4 border-b border-slate-100">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Contractor Portal
        </p>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems(slug).map(({ label, href, icon: Icon }) => {
          const active =
            href === `/${slug}/dashboard`
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-orange-50 text-orange-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
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
    </aside>
  );
}
