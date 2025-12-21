"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SiteFooter } from "../../components/site/SiteFooter";
import { SiteHeader } from "../../components/site/SiteHeader";
import dayjs from "dayjs";

type Schedule = {
  _id: string;
  number?: string;
  company: { _id: string; name: string } | null;
  bus: {
    _id: string;
    number: string;
    type: string;
  } | null;
  route: {
    _id: string;
    name: string;
    from: { _id: string; name: string } | string;
    to: { _id: string; name: string } | string;
  } | null;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: string;
};

function SearchResults() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "1";

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!from || !to || !date) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          from,
          to,
          date,
          passengers,
        });
        const res = await fetch(`/api/bus/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSchedules(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [from, to, date, passengers]);

  const formatTime = (timeString: string) => {
    return dayjs(timeString).format("h:mm A");
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM D, YYYY");
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = dayjs(departure);
    const arr = dayjs(arrival);
    const diff = arr.diff(dep, "minute");
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(16,185,129,0.22),transparent_60%),radial-gradient(900px_500px_at_110%_0%,rgba(34,211,238,0.12),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,1))] dark:bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(900px_500px_at_110%_0%,rgba(34,211,238,0.10),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,0.9),rgba(2,6,23,1))]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xl dark:bg-slate-900">
                🚌
              </span>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Bus results
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-white">
              {from} → {to} • {date} • {passengers} passenger(s)
            </p>
          </div>

          <Link
            href="/bus"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700"
          >
            Modify search
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
            Loading...
          </div>
        ) : schedules.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950">
            <p className="text-slate-600 dark:text-slate-400">
              No buses found for this route and date.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {schedules.map((schedule) => {
              const fromName =
                typeof schedule.route?.from === "object"
                  ? schedule.route.from.name
                  : schedule.route?.from || from;
              const toName =
                typeof schedule.route?.to === "object"
                  ? schedule.route.to.name
                  : schedule.route?.to || to;

              return (
                <div
                  key={schedule._id}
                  className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 p-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                          {schedule.company?.name || "Bus Service"}
                        </h3>
                        {schedule.number && (
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Trip {schedule.number}
                          </span>
                        )}
                        {schedule.bus && (
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            {schedule.bus.type}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {formatTime(schedule.departureTime)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-white">
                            {fromName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(schedule.departureTime)}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="text-center text-sm text-slate-600 dark:text-white">
                            {calculateDuration(
                              schedule.departureTime,
                              schedule.arrivalTime
                            )}
                          </div>
                          <div className="mt-1 h-0.5 w-full bg-slate-200 dark:bg-slate-800" />
                        </div>

                        <div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {formatTime(schedule.arrivalTime)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-white">
                            {toName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(schedule.arrivalTime)}
                          </div>
                        </div>
                      </div>

                      {schedule.bus && (
                        <div className="mt-3 text-sm text-slate-600 dark:text-white">
                          Bus: {schedule.bus.number}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                        ৳{schedule.price}
                        <span className="ml-1 text-sm font-normal text-slate-600 dark:text-white">
                          /person
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <Link
                          href={`/dashboard/tickets?scheduleId=${schedule._id}`}
                          className="w-full rounded-md bg-[#0071c2] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#00508f]"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}

export default function BusSearchPage() {
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

