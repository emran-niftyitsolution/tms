"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type TravelMode = "air" | "bus" | "train" | "ship";

type Result = {
  id: number;
  brand: string;
  code: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seats: number;
  stops: string;
  vehicle: string;
  rating: number;
};

function modeMeta(mode: TravelMode) {
  switch (mode) {
    case "bus":
      return { title: "Bus results", icon: "🚌", backHref: "/bus" };
    case "train":
      return { title: "Train results", icon: "🚆", backHref: "/train" };
    case "ship":
      return { title: "Ship results", icon: "🛳️", backHref: "/ship" };
    default:
      return { title: "Flight results", icon: "✈️", backHref: "/air" };
  }
}

function mockResults(mode: TravelMode): Result[] {
  if (mode === "bus") {
    return [
      {
        id: 1,
        brand: "GreenLine Express",
        code: "GL-220",
        departure: "06:30 AM",
        arrival: "12:10 PM",
        duration: "5h 40m",
        price: 18,
        seats: 23,
        stops: "Non-stop",
        vehicle: "AC Coach • 2+1 seats",
        rating: 4.6,
      },
      {
        id: 2,
        brand: "Royal Coach",
        code: "RC-118",
        departure: "09:00 AM",
        arrival: "03:20 PM",
        duration: "6h 20m",
        price: 14,
        seats: 9,
        stops: "1 stop",
        vehicle: "AC Coach • Wi‑Fi",
        rating: 4.4,
      },
      {
        id: 3,
        brand: "Night Rider",
        code: "NR-901",
        departure: "10:30 PM",
        arrival: "05:40 AM",
        duration: "7h 10m",
        price: 12,
        seats: 17,
        stops: "Non-stop",
        vehicle: "Sleeper • Blanket included",
        rating: 4.2,
      },
    ];
  }

  if (mode === "train") {
    return [
      {
        id: 1,
        brand: "InterCity Express",
        code: "IC-704",
        departure: "07:10 AM",
        arrival: "12:05 PM",
        duration: "4h 55m",
        price: 9,
        seats: 42,
        stops: "Limited stops",
        vehicle: "AC Chair • Bistro",
        rating: 4.7,
      },
      {
        id: 2,
        brand: "Commuter Rapid",
        code: "CR-112",
        departure: "10:40 AM",
        arrival: "04:10 PM",
        duration: "5h 30m",
        price: 6,
        seats: 80,
        stops: "All stops",
        vehicle: "Non‑AC • Family friendly",
        rating: 4.1,
      },
      {
        id: 3,
        brand: "Sunset Line",
        code: "SL-330",
        departure: "05:30 PM",
        arrival: "10:20 PM",
        duration: "4h 50m",
        price: 8,
        seats: 16,
        stops: "Limited stops",
        vehicle: "AC Chair • Quiet coach",
        rating: 4.5,
      },
    ];
  }

  if (mode === "ship") {
    return [
      {
        id: 1,
        brand: "BayCruise",
        code: "BC-21",
        departure: "08:00 AM",
        arrival: "01:30 PM",
        duration: "5h 30m",
        price: 22,
        seats: 28,
        stops: "Direct",
        vehicle: "Deck seat • Refreshments",
        rating: 4.5,
      },
      {
        id: 2,
        brand: "Coastal Ferry",
        code: "CF-08",
        departure: "11:30 AM",
        arrival: "06:10 PM",
        duration: "6h 40m",
        price: 16,
        seats: 65,
        stops: "1 stop",
        vehicle: "Cabin available • Family cabin",
        rating: 4.2,
      },
      {
        id: 3,
        brand: "OceanLink",
        code: "OL-55",
        departure: "06:00 PM",
        arrival: "11:45 PM",
        duration: "5h 45m",
        price: 19,
        seats: 14,
        stops: "Direct",
        vehicle: "VIP cabin • Priority boarding",
        rating: 4.6,
      },
    ];
  }

  // air
  return [
    {
      id: 1,
      brand: "SkyWings Airlines",
      code: "SW-2451",
      departure: "06:00 AM",
      arrival: "11:30 AM",
      duration: "5h 30m",
      price: 199,
      seats: 45,
      stops: "Non-stop",
      vehicle: "Boeing 737",
      rating: 4.5,
    },
    {
      id: 2,
      brand: "Global Air",
      code: "GA-1820",
      departure: "09:15 AM",
      arrival: "02:30 PM",
      duration: "5h 15m",
      price: 249,
      seats: 12,
      stops: "Non-stop",
      vehicle: "Airbus A320",
      rating: 4.8,
    },
    {
      id: 3,
      brand: "Express Jet",
      code: "EJ-4102",
      departure: "12:30 PM",
      arrival: "06:45 PM",
      duration: "6h 15m",
      price: 159,
      seats: 28,
      stops: "1 stop",
      vehicle: "Embraer E190",
      rating: 4.3,
    },
    {
      id: 4,
      brand: "Premium Airways",
      code: "PA-7890",
      departure: "04:00 PM",
      arrival: "09:15 PM",
      duration: "5h 15m",
      price: 299,
      seats: 8,
      stops: "Non-stop",
      vehicle: "Boeing 787",
      rating: 4.9,
    },
  ];
}

export function TransportSearchResults({ mode }: { mode: TravelMode }) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "1";

  const meta = modeMeta(mode);
  const results = mockResults(mode);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(900px_500px_at_110%_0%,rgba(34,211,238,0.20),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,1))] dark:bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(99,102,241,0.22),transparent_60%),radial-gradient(900px_500px_at_110%_0%,rgba(34,211,238,0.16),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,0.9),rgba(2,6,23,1))]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 text-xl ring-1 ring-slate-200/70 backdrop-blur dark:bg-slate-950/50 dark:ring-slate-800">
                {meta.icon}
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {meta.title}
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {from} → {to}
              {date ? ` • ${date}` : ""} • {passengers} traveler(s)
            </p>
          </div>

          <Link
            href={meta.backHref}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700"
          >
            Modify search
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Filters
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Stops
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-300 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-slate-700">
                    <option>Any</option>
                    <option>Direct / Non-stop</option>
                    <option>1 stop</option>
                    <option>2+ stops</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sort
                  </label>
                  <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-300 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-slate-700">
                    <option>Recommended</option>
                    <option>Lowest price</option>
                    <option>Shortest duration</option>
                    <option>Highest rating</option>
                  </select>
                </div>

                <div className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-white dark:bg-white dark:text-slate-900">
                  Tip: try switching modes on the homepage for a unified
                  experience.
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9">
            <div className="space-y-4">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                          {r.brand}
                        </h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {r.code} • ★ {r.rating}
                        </span>
                        <span className="rounded-xl bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-950/50 dark:text-slate-300 dark:ring-slate-800">
                          {r.stops}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {r.departure}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {from}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                            {r.duration}
                          </div>
                          <div className="mt-1 h-0.5 w-full bg-slate-200 dark:bg-slate-800" />
                        </div>

                        <div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {r.arrival}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {to}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        {r.vehicle}
                      </div>
                    </div>

                    <div className="shrink-0 rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {r.seats} seats left
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                        ${r.price}
                        <span className="ml-1 text-sm font-normal text-slate-600 dark:text-slate-400">
                          /person
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <button className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                          Book
                        </button>
                        <button className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


