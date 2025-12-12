import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-white/40 backdrop-blur dark:bg-black/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-sm">
                T
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  TMS Tickets
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Book bus, train, air & ship — fast.
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
              A modern ticketing experience inspired by premium travel UIs:
              clean typography, soft gradients, and conversion-friendly layout.
            </p>
          </div>

          <div className="grid gap-6 md:col-span-7 md:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Products
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <Link
                  href="/bus"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Bus tickets
                </Link>
                <Link
                  href="/train"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Train tickets
                </Link>
                <Link
                  href="/air"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Air tickets
                </Link>
                <Link
                  href="/ship"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Ship tickets
                </Link>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Company
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span>About</span>
                <span>Support</span>
                <span>Partners</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Security
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span>Secure payments</span>
                <span>Verified operators</span>
                <span>Instant e‑tickets</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/60 pt-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} TMS Tickets</span>
          <span>Built with Next.js + Tailwind</span>
        </div>
      </div>
    </footer>
  );
}


