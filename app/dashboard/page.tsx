type BookingStatus = "Paid" | "Pending" | "Cancelled";

type Booking = {
  id: string;
  customer: string;
  route: string;
  mode: "Bus" | "Train" | "Air" | "Ship";
  date: string;
  amount: string;
  status: BookingStatus;
};

const bookings: Booking[] = [
  {
    id: "BK-10294",
    customer: "Arif Hasan",
    route: "Dhaka → Chittagong",
    mode: "Air",
    date: "Dec 20, 2025",
    amount: "$249",
    status: "Paid",
  },
  {
    id: "BK-10293",
    customer: "Nusrat Jahan",
    route: "Dhaka → Sylhet",
    mode: "Train",
    date: "Dec 18, 2025",
    amount: "$8",
    status: "Pending",
  },
  {
    id: "BK-10292",
    customer: "Rahim Uddin",
    route: "Dhaka → Cox’s Bazar",
    mode: "Bus",
    date: "Dec 17, 2025",
    amount: "$14",
    status: "Paid",
  },
  {
    id: "BK-10291",
    customer: "Tania Akter",
    route: "Chittagong → Saint Martin",
    mode: "Ship",
    date: "Dec 22, 2025",
    amount: "$19",
    status: "Cancelled",
  },
];

const demandTrend = [
  { day: "D1", height: 18 },
  { day: "D2", height: 28 },
  { day: "D3", height: 24 },
  { day: "D4", height: 36 },
  { day: "D5", height: 22 },
  { day: "D6", height: 40 },
  { day: "D7", height: 34 },
  { day: "D8", height: 46 },
  { day: "D9", height: 38 },
  { day: "D10", height: 52 },
  { day: "D11", height: 44 },
  { day: "D12", height: 60 },
  { day: "D13", height: 48 },
  { day: "D14", height: 58 },
];

function StatusPill({ status }: { status: BookingStatus }) {
  const cls =
    status === "Paid"
      ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
      : status === "Pending"
        ? "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300"
        : "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        cls,
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
        </div>
        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
          {delta}
        </span>
      </div>
      <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        {hint}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Bookings (7d)"
          value="1,284"
          delta="+12%"
          hint="Strong week-over-week growth across all modes."
        />
        <StatCard
          label="Revenue (7d)"
          value="$38,420"
          delta="+8%"
          hint="Higher AOV driven by air & premium cabins."
        />
        <StatCard
          label="Conversion"
          value="3.8%"
          delta="+0.4%"
          hint="Hero search improvements are paying off."
        />
        <StatCard
          label="Support SLA"
          value="92%"
          delta="+3%"
          hint="Median response time: 12m (last 24h)."
        />
      </div>

      {/* Mini chart card (static visual) */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Demand trend
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Last 14 days (visual placeholder)
            </div>
          </div>
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-500/20 dark:text-indigo-300">
            +18% peak
          </span>
        </div>
        <div className="px-5 pb-5">
          <div className="grid h-28 grid-cols-14 items-end gap-1">
            {demandTrend.map((x) => (
              <div
                key={x.day}
                className="rounded-full bg-gradient-to-t from-indigo-500/60 via-sky-500/40 to-cyan-400/30"
                style={{ height: `${x.height}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div
        id="bookings"
        className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent bookings
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Latest activity across bus, train, air & ship.
            </div>
          </div>
          <a
            href="#bookings"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            View all →
          </a>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2 pr-4">Booking</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Route</th>
                <th className="py-2 pr-4">Mode</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-0">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {bookings.map((b) => (
                <tr key={b.id} className="align-middle">
                  <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                    {b.id}
                  </td>
                  <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                    {b.customer}
                  </td>
                  <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                    {b.route}
                  </td>
                  <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                    {b.mode}
                  </td>
                  <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                    {b.date}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                    {b.amount}
                  </td>
                  <td className="py-3 pr-0">
                    <StatusPill status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Operator health
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            High-signal checks to keep quality premium.
          </div>

          <div className="mt-4 grid gap-3">
            {[
              { k: "On-time performance", v: "89%", s: "Good" },
              { k: "Payment success", v: "98.4%", s: "Excellent" },
              { k: "Refund turnaround", v: "2.1d", s: "Good" },
            ].map((x) => (
              <div
                key={x.k}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {x.k}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Status: {x.s}
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {x.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Tasks
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Keep the product moving (mock).
          </div>

          <div className="mt-4 grid gap-2 text-sm">
            {[
              "Add real booking API integration",
              "Connect payment provider webhooks",
              "Build operator onboarding flow",
              "Add seat-map UI (bus/train)",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <span className="font-semibold text-slate-900 dark:text-white">
                  {t}
                </span>
                <span className="text-slate-500 dark:text-slate-400">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


