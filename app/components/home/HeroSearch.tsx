"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiCalendar, FiMapPin, FiSearch, FiUsers } from "react-icons/fi";

export type TravelMode = "bus" | "train" | "air" | "ship";

type ModeMeta = {
  mode: TravelMode;
  label: string;
  icon: string;
  hint: string;
  pillClassName: string;
};

const MODES: ModeMeta[] = [
  {
    mode: "bus",
    label: "Bus",
    icon: "🚌",
    hint: "AC & non‑AC buses",
    pillClassName: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  {
    mode: "train",
    label: "Train",
    icon: "🚆",
    hint: "Seat selection",
    pillClassName: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  },
  {
    mode: "air",
    label: "Air",
    icon: "✈️",
    hint: "Fast comparisons",
    pillClassName: "bg-sky-50 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  },
  {
    mode: "ship",
    label: "Ship",
    icon: "🛳️",
    hint: "Cabins & decks",
    pillClassName: "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  },
];

export function HeroSearch({
  initialMode = "air",
  showModeTabs = true,
}: {
  initialMode?: TravelMode;
  showModeTabs?: boolean;
}) {
  const [mode, setMode] = useState<TravelMode>(initialMode);

  const meta = useMemo(
    () => MODES.find((m) => m.mode === mode) ?? MODES[2],
    [mode],
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/40 sm:p-8">
      {/* Glow effect */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        {showModeTabs ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
              {MODES.map((m) => {
                const active = m.mode === mode;
                return (
                  <button
                    key={m.mode}
                    type="button"
                    onClick={() => setMode(m.mode)}
                    className={[
                      "relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                      active
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
                    ].join(" ")}
                  >
                    <span className="text-base">{m.icon}</span>
                    {m.label}
                  </button>
                );
              })}
            </div>
            
            <span
              className={[
                "ml-auto hidden rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset md:inline-flex",
                meta.pillClassName,
              ].join(" ")}
            >
              {meta.hint}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl dark:bg-slate-800">
                {meta.icon}
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {meta.label} tickets
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {meta.hint}
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="group flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
            >
              Change mode <span className="transition group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        )}

        <form
          action={`/${mode}/search`}
          method="get"
          className="grid grid-cols-1 gap-4 md:grid-cols-12"
        >
          {/* From Input */}
          <div className="group relative rounded-2xl bg-white p-3 ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-950 dark:ring-slate-800 md:col-span-3">
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">From</label>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-slate-400" />
              <input
                name="from"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none dark:text-white dark:placeholder:text-slate-600"
                placeholder="City or Station"
                defaultValue="Dhaka"
              />
            </div>
          </div>

          {/* To Input */}
          <div className="group relative rounded-2xl bg-white p-3 ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-950 dark:ring-slate-800 md:col-span-3">
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">To</label>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-slate-400" />
              <input
                name="to"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none dark:text-white dark:placeholder:text-slate-600"
                placeholder="City or Station"
                defaultValue="Chittagong"
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="group relative rounded-2xl bg-white p-3 ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-950 dark:ring-slate-800 md:col-span-3">
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Journey Date</label>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-slate-400" />
              <input
                type="date"
                name="date"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none dark:text-white"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>

          {/* Passengers Input */}
          <div className="group relative rounded-2xl bg-white p-3 ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-950 dark:ring-slate-800 md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Passengers</label>
            <div className="flex items-center gap-2">
              <FiUsers className="text-slate-400" />
              <input
                type="number"
                min={1}
                max={9}
                name="passengers"
                defaultValue={1}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1">
            <button
              type="submit"
              className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <FiSearch className="text-xl" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
             Instant e-tickets
          </span>
          <span className="flex items-center gap-1.5">
             <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
             Secure checkout
          </span>
          <span className="flex items-center gap-1.5">
             <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
             24/7 Support
          </span>
        </div>
      </div>
    </div>
  );
}



