"use client";

import { Avatar } from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiStar } from "react-icons/fi";
import { FeatureSection } from "./components/home/FeatureSection";
import { HeroSearch } from "./components/home/HeroSearch";
import { ProcessSection } from "./components/home/ProcessSection";
import { TestimonialsSection } from "./components/home/TestimonialsSection";
import { SiteFooter } from "./components/site/SiteFooter";
import { SiteHeader } from "./components/site/SiteHeader";
import { InfiniteMarquee } from "./components/ui/InfiniteMarquee";

export default function Home() {
  const brands = [
    { name: "GreenLine" },
    { name: "US-Bangla" },
    { name: "Shohagh" },
    { name: "Ena" },
    { name: "Hanif" },
    { name: "Saint Martin Paribahan" },
    { name: "Novoair" },
    { name: "Biman" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-800 selection:bg-indigo-500/30">
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] w-full flex flex-col items-center pt-0 overflow-hidden">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 pointer-events-none">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 bg-white dark:bg-black/80 backdrop-blur-3xl" />
          </div>

          {/* Header Inside Hero */}
          <SiteHeader transparent />

          <div className="max-w-7xl relative mx-auto px-4 z-10 flex-1 flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full pt-12 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 backdrop-blur-sm mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    #1 Travel Platform in BD
                  </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]">
                  Explore the world, <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">
                    one ticket at a time.
                  </span>
                </h1>

                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Seamlessly book bus, train, air, and ship tickets. Experience
                  the future of travel with instant confirmations and 24/7
                  support.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="#search"
                    className="px-8 py-4 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 hover:scale-105 transition-all duration-200 shadow-lg shadow-indigo-500/25"
                  >
                    Start Booking
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black/50 backdrop-blur-sm text-zinc-900 dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    View Demo
                  </Link>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
                  <Avatar.Group
                    max={{ count: 4 }}
                    size={40}
                    maxStyle={{
                      color: "#fff",
                      backgroundColor: "#6366f1",
                      border: "2px solid white",
                    }}
                  >
                    {[
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop&crop=face",
                    ].map((img, i) => (
                      <Avatar
                        key={i}
                        src={img}
                        alt={`Happy traveler ${i + 1}`}
                        style={{
                          border: "2px solid white",
                        }}
                      />
                    ))}
                  </Avatar.Group>
                  <div className="text-sm">
                    <p className="font-bold text-zinc-900 dark:text-white">
                      50k+ Happy Travelers
                    </p>
                    <div className="flex text-yellow-500 text-xs">★★★★★</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-30 animate-pulse" />
                <HeroSearch />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-10 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
          <InfiniteMarquee items={brands} speed="normal" />
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 bg-white dark:bg-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
              Why Choose TMS?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              We&apos;ve re-engineered the booking experience to be faster,
              safer, and more reliable than ever before.
            </p>
          </div>
          <FeatureSection />
        </section>

        {/* How It Works */}
        <ProcessSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Popular Routes Parallax/Grid */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                  Trending Destinations
                </h2>
                <p className="text-zinc-500 dark:text-slate-400">
                  Most booked routes this week
                </p>
              </div>
              <Link
                href="/air"
                className="hidden md:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                View all destinations <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  city: "Cox's Bazar",
                  price: "$14",
                  mode: "Bus",
                  img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1000&auto=format&fit=crop",
                  colSpan: "lg:col-span-2",
                },
                {
                  city: "Sylhet",
                  price: "$8",
                  mode: "Train",
                  img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1000&auto=format&fit=crop",
                  colSpan: "lg:col-span-1",
                },
                {
                  city: "Chittagong",
                  price: "$199",
                  mode: "Air",
                  img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop",
                  colSpan: "lg:col-span-1",
                },
                {
                  city: "Saint Martin",
                  price: "$22",
                  mode: "Ship",
                  img: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=1000&auto=format&fit=crop",
                  colSpan: "lg:col-span-2", // Fixed col-span
                },
                {
                  city: "Sundarbans",
                  price: "$45",
                  mode: "Ship",
                  img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop",
                  colSpan: "lg:col-span-2",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative h-80 overflow-hidden rounded-3xl bg-zinc-200 dark:bg-zinc-800 ${
                    item.colSpan || ""
                  }`}
                >
                  <Image
                    src={item.img}
                    alt={item.city}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 w-full p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-full bg-white dark:bg-slate-800/20 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
                        {item.mode}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-medium text-yellow-400 bg-black/30 px-2 py-1 rounded-full backdrop-blur-md">
                        <FiStar className="fill-current" /> 4.9
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold">{item.city}</h3>
                    <p className="text-sm text-zinc-300">
                      Starting from{" "}
                      <span className="text-white font-semibold">
                        {item.price}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative rounded-[3rem] bg-zinc-900 dark:bg-zinc-900 overflow-hidden px-6 py-20 text-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[20px_20px]"></div>
              </div>

              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to travel smartly?
                </h2>
                <p className="text-zinc-400 text-lg mb-10">
                  Join thousands of users who have switched to the modern way of
                  booking tickets. Download our app or continue on the web.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25">
                    Download App
                  </button>
                  <button className="px-8 py-4 rounded-full border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition-colors">
                    Continue Web
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
