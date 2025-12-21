"use client";

import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import Image from "next/image";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rafiqul Islam",
      role: "Frequent Traveler",
      quote:
        "TMS made my trip to Chittagong so much easier. I booked my train tickets in seconds and didn't have to stand in line at the station.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Sarah Ahmed",
      role: "Business Commuter",
      quote:
        "I love the real-time tracking feature for buses. It saves me so much anxiety knowing exactly when my bus will arrive.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Tanvir Hasan",
      role: "Adventure Seeker",
      quote:
        "Booking air tickets to Cox's Bazar was a breeze. The price comparison tool helped me find the best deal instantly.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-800 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
       <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

       <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">Loved by Travelers</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Don&apos;t just take our word for it. Here&apos;s what our users have to say about their experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl relative"
              >
                <div className="flex gap-1 text-yellow-500 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-current" />
                  ))}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 mb-8 italic text-lg leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white dark:border-zinc-700 shadow-sm">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-zinc-500 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
       </div>
    </section>
  );
}

