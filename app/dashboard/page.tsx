"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown, FiActivity, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

type BookingStatus = "Paid" | "Pending" | "Cancelled" | "Confirmed";

type Booking = {
  id: string;
  customer: string;
  route: string;
  mode: "Bus" | "Train" | "Air" | "Ship";
  date: string;
  amount: string;
  status: BookingStatus;
  phone?: string;
  email?: string;
};

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
    status === "Paid" || status === "Confirmed"
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
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  hint: string;
  icon: any;
  trend: "up" | "down";
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-slate-50 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Icon size={20} />
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
          {delta}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-400">{hint}</div>
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        if (res.ok) {
          const tickets = await res.json();
          
          // Transform tickets to bookings
          const transformedBookings: Booking[] = tickets
            .slice(0, 10) // Show only recent 10
            .map((ticket: any) => {
              const routeName = ticket.schedule?.route?.name || "Unknown Route";
              const fromName = typeof ticket.schedule?.route?.from === "object" 
                ? ticket.schedule.route.from.name 
                : "Unknown";
              const toName = typeof ticket.schedule?.route?.to === "object" 
                ? ticket.schedule.route.to.name 
                : "Unknown";
              
              return {
                id: ticket.ticketNumber || ticket._id,
                customer: ticket.passengerName || "Unknown",
                route: `${fromName} → ${toName}`,
                mode: "Bus" as const,
                date: dayjs(ticket.bookingDate || ticket.createdAt).format("MMM D, YYYY"),
                amount: `৳${ticket.finalAmount || ticket.totalFare || 0}`,
                status: (ticket.status === "Confirmed" ? "Confirmed" : ticket.status === "Cancelled" ? "Cancelled" : "Pending") as BookingStatus,
                phone: ticket.passengerPhone,
                email: ticket.passengerEmail,
              };
            });

          setBookings(transformedBookings);

          // Calculate stats
          const totalBookings = tickets.length;
          const totalRevenue = tickets.reduce((sum: number, t: any) => sum + (t.finalAmount || t.totalFare || 0), 0);
          const avgOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
          const pendingRequests = tickets.filter((t: any) => t.status === "Pending").length;

          setStats({
            totalBookings,
            totalRevenue,
            avgOrderValue,
            pendingRequests,
          });
        }
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats */}
      <motion.div variants={item} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value={loading ? "..." : stats.totalBookings.toLocaleString()}
          delta=""
          trend="up"
          hint="Total tickets booked"
          icon={FiActivity}
        />
        <StatCard
          label="Total Revenue"
          value={loading ? "..." : `৳${stats.totalRevenue.toLocaleString()}`}
          delta=""
          trend="up"
          hint="Total revenue from tickets"
          icon={FiTrendingUp}
        />
        <StatCard
          label="Avg. Order Value"
          value={loading ? "..." : `৳${Math.round(stats.avgOrderValue).toLocaleString()}`}
          delta=""
          trend="up"
          hint="Average ticket price"
          icon={FiTrendingDown}
        />
        <StatCard
          label="Pending Requests"
          value={loading ? "..." : stats.pendingRequests.toString()}
          delta=""
          trend="up"
          hint="Requires attention"
          icon={FiClock}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Demand Chart */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Demand Overview
              </h3>
              <p className="text-sm text-slate-500">Booking traffic over the last 14 days</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
              +18% Peak
            </span>
          </div>
          
          <div className="grid h-48 grid-cols-14 items-end gap-2 sm:gap-4">
            {demandTrend.map((x, i) => (
              <motion.div
                key={x.day}
                initial={{ height: 0 }}
                animate={{ height: `${x.height}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative group w-full rounded-t-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-colors"
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-lg bg-indigo-500 dark:bg-indigo-500"
                  style={{ height: "40%", opacity: 0.8 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tasks / Activity */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Action Items
          </h3>
          <div className="space-y-3">
             {[
               { title: "Review pending refunds", time: "2h ago", color: "bg-orange-500" },
               { title: "Update holiday pricing", time: "5h ago", color: "bg-blue-500" },
               { title: "Check server logs", time: "1d ago", color: "bg-emerald-500" },
               { title: "Onboard new operator", time: "1d ago", color: "bg-purple-500" },
             ].map((task, i) => (
               <div key={i} className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                 <div className={`h-2 w-2 rounded-full ${task.color}`} />
                 <div className="flex-1">
                   <div className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</div>
                   <div className="text-xs text-slate-500">{task.time}</div>
                 </div>
                 <div className="h-6 w-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors cursor-pointer">
                    →
                 </div>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Recent bookings */}
      <motion.div
        variants={item}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent Bookings
            </h3>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">Ticket Number</th>
                <th className="px-6 py-3">Passenger</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                      {b.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {b.customer}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <div className="text-xs">
                        {b.phone && <div>{b.phone}</div>}
                        {b.email && <div className="text-slate-400">{b.email}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {b.route}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {b.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {b.amount}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={b.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
