"use client";
import React from "react";
import { FiSearch, FiCheckCircle, FiCreditCard } from "react-icons/fi";

export function ProcessSection() {
  const steps = [
    {
      title: "Search",
      description: "Enter your origin, destination, and travel dates to find the best available tickets.",
      icon: <FiSearch className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Select & Book",
      description: "Compare prices, schedules, and operators. Choose the one that fits your needs.",
      icon: <FiCheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Pay Securely",
      description: "Complete your payment with our secure gateway and get instant e-ticket confirmation.",
      icon: <FiCreditCard className="h-6 w-6 text-pink-600 dark:text-pink-400" />,
      bg: "bg-pink-100 dark:bg-pink-900/30",
    },
  ];

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Booking your next trip is as easy as 1-2-3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-3xl ${step.bg} flex items-center justify-center mb-6 shadow-sm`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

