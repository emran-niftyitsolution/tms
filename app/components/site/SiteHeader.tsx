import Link from "next/link";
import { cn } from "../ui/BentoGrid"; // Re-using cn utility if available, or just standard template literal

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bus", label: "Bus" },
  { href: "/train", label: "Train" },
  { href: "/air", label: "Air" },
  { href: "/ship", label: "Ship" },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  return (
    <header
      className={cn(
        "z-40 w-full transition-colors duration-300",
        transparent
          ? "absolute top-0 border-b border-transparent bg-transparent"
          : "sticky top-0 border-b border-white/10 bg-white/60 backdrop-blur-xl dark:bg-black/40"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-sm">
            T
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
            TMS Tickets
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 dark:text-white dark:hover:bg-white dark:bg-slate-800/10 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
