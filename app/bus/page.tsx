import { HeroSearch } from "../components/home/HeroSearch";
import { SiteFooter } from "../components/site/SiteFooter";
import { SiteHeader } from "../components/site/SiteHeader";

export default function BusPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(16,185,129,0.22),transparent_60%),radial-gradient(900px_500px_at_110%_0%,rgba(34,211,238,0.12),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,1))] dark:bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(900px_500px_at_110%_0%,rgba(34,211,238,0.10),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,0.9),rgba(2,6,23,1))]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Book bus tickets with confidence.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-white">
              Verified operators, clean timings, and seat availability — wrapped
              in a modern UI.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { k: "Verified operators", v: "Trusted brands & routes" },
                { k: "Sleeper options", v: "Night trips made easy" },
                { k: "Real availability", v: "Seat count shown clearly" },
                { k: "Instant ticket", v: "SMS/email in seconds" },
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
            <HeroSearch initialMode="bus" showModeTabs={false} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}


