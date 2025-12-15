"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Bookings", href: "/dashboard#bookings" },
  { label: "Customers", href: "/dashboard#customers" },
  { label: "Operators", href: "/dashboard#operators" },
  { label: "Settings", href: "/dashboard#settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:col-span-3">
      <div className="sticky top-6 rounded-2xl border border-slate-200/70 bg-white dark:bg-slate-800/70 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-sm">
            T
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              TMS Dashboard
            </div>
            <div className="text-xs text-slate-600 dark:text-white dark:text-slate-300">
              Portal navigation
            </div>
          </div>
        </Link>

        <nav className="mt-6 grid gap-1 text-sm">
          {nav.map((item) => {
            const active = item.href === "/dashboard" && pathname === "/dashboard";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "rounded-xl px-3 py-2 font-semibold transition",
                  active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-white"
                    : "text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white dark:bg-slate-800 dark:text-white">
          <div className="text-sm font-semibold">Quick actions</div>
          <div className="mt-3 grid gap-2">
            <Link
              href="/air"
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white dark:bg-slate-800/15 dark:bg-slate-900/10 dark:hover:bg-slate-900/15"
            >
              Create a booking →
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white dark:bg-slate-800/15 dark:bg-slate-900/10 dark:hover:bg-slate-900/15"
            >
              View public homepage →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}


