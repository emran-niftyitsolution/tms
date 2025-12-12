"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "1";

  // Mock search results
  const results = [
    {
      id: 1,
      airline: "SkyWings Airlines",
      flight: "SW-2451",
      departure: "06:00 AM",
      arrival: "11:30 AM",
      duration: "5h 30m",
      price: 199,
      seats: 45,
      stops: "Non-stop",
      aircraft: "Boeing 737",
      rating: 4.5,
    },
    {
      id: 2,
      airline: "Global Air",
      flight: "GA-1820",
      departure: "09:15 AM",
      arrival: "2:30 PM",
      duration: "5h 15m",
      price: 249,
      seats: 12,
      stops: "Non-stop",
      aircraft: "Airbus A320",
      rating: 4.8,
    },
    {
      id: 3,
      airline: "Express Jet",
      flight: "EJ-4102",
      departure: "12:30 PM",
      arrival: "6:45 PM",
      duration: "6h 15m",
      price: 159,
      seats: 28,
      stops: "1 stop",
      aircraft: "Embraer E190",
      rating: 4.3,
    },
    {
      id: 4,
      airline: "Premium Airways",
      flight: "PA-7890",
      departure: "04:00 PM",
      arrival: "9:15 PM",
      duration: "5h 15m",
      price: 299,
      seats: 8,
      stops: "Non-stop",
      aircraft: "Boeing 787",
      rating: 4.9,
    },
  ];

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xl dark:bg-slate-900">
                ✈️
              </span>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Flight results
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {from} → {to} • {date} • {passengers} traveler(s)
            </p>
          </div>

          <Link
            href="/air"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700"
          >
            Modify search
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Filters */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Filters
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Stops
                  </label>
                  <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#0071c2] focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    <option>Any</option>
                    <option>Non-stop</option>
                    <option>1 stop</option>
                    <option>2+ stops</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sort
                  </label>
                  <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#0071c2] focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    <option>Recommended</option>
                    <option>Lowest price</option>
                    <option>Shortest duration</option>
                    <option>Highest rating</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="lg:col-span-8 xl:col-span-9">
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                          {result.airline}
                        </h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Flight {result.flight} • ★ {result.rating}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                          {result.stops}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {result.departure}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {from}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                            {result.duration}
                          </div>
                          <div className="mt-1 h-0.5 w-full bg-slate-200 dark:bg-slate-800" />
                        </div>

                        <div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {result.arrival}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {to}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        {result.aircraft}
                      </div>
                    </div>

                    <div className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {result.seats} seats left
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                        ${result.price}
                        <span className="ml-1 text-sm font-normal text-slate-600 dark:text-slate-400">
                          /person
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <button className="w-full rounded-md bg-[#0071c2] py-2.5 text-sm font-semibold text-white hover:bg-[#00508f]">
                          Book
                        </button>
                        <button className="w-full rounded-md border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700">
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

export default function AirSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl">Loading...</div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
