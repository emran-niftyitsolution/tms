import { HeroSearch } from "../components/home/HeroSearch";
import { SiteFooter } from "../components/site/SiteFooter";
import { SiteHeader } from "../components/site/SiteHeader";

export default function ShipPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(245,158,11,0.22),transparent_60%),radial-gradient(900px_500px_at_110%_0%,rgba(34,211,238,0.12),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,1))] dark:bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(245,158,11,0.18),transparent_60%),radial-gradient(900px_500px_at_110%_0%,rgba(34,211,238,0.10),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,0.9),rgba(2,6,23,1))]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Ship tickets, simplified.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-white">
              Coastal routes, cabins, and deck options — presented with modern,
              high-clarity UI.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { k: "Cabin options", v: "Deck, standard, VIP" },
                { k: "Clear timings", v: "Ports & duration upfront" },
                { k: "Verified ferries", v: "Trusted operators" },
                { k: "Instant ticket", v: "Always accessible" },
              ].map((i) => (
                <div
                  key={i.k}
                  className="rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 p-4 backdrop-blur dark:bg-slate-950/30"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {i.k}
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-white">
                    {i.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeroSearch initialMode="ship" showModeTabs={false} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}


