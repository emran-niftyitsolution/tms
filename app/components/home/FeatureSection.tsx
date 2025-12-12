"use client";

import { motion } from "framer-motion";
import { FiCheckCircle, FiShield, FiSmartphone, FiTrendingUp } from "react-icons/fi";
import { BentoGrid, BentoGridItem } from "../ui/BentoGrid";

export function FeatureSection() {
  const items = [
    {
      title: "Bank-Grade Security",
      description: "Every transaction is encrypted with industry-standard protocols.",
      header: <SkeletonOne />,
      icon: <FiShield className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Instant E-Tickets",
      description: "No printing needed. Just show your phone and go.",
      header: <SkeletonTwo />,
      icon: <FiSmartphone className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Verified Operators",
      description: "We partner only with the top 1% of transport providers.",
      header: <SkeletonThree />,
      icon: <FiCheckCircle className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Real-time Tracking",
      description: "Know exactly where your bus or train is at all times.",
      header: <SkeletonFour />,
      icon: <FiTrendingUp className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
  ];

  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={item.className}
        />
      ))}
    </BentoGrid>
  );
}

const SkeletonOne = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-8 items-center justify-center">
        <div className="text-6xl font-bold text-neutral-300 dark:text-neutral-700">
            SSL/TLS
        </div>
    </div>
  );
};
const SkeletonTwo = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex-col gap-2 p-4">
       <div className="h-4 w-full bg-neutral-300 dark:bg-neutral-700 rounded-full animate-pulse"></div>
       <div className="h-4 w-3/4 bg-neutral-300 dark:bg-neutral-700 rounded-full animate-pulse delay-75"></div>
       <div className="h-20 w-20 mx-auto mt-4 bg-neutral-300 dark:bg-neutral-700 rounded-lg"></div>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            <FiCheckCircle className="text-8xl text-neutral-300 dark:text-neutral-700 opacity-50" />
        </div>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-end pb-4 px-4 gap-2">
        <motion.div 
            initial={{ height: 20 }}
            animate={{ height: 100 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="w-8 bg-neutral-300 dark:bg-neutral-700 rounded-t-lg" 
        />
        <motion.div 
            initial={{ height: 40 }}
            animate={{ height: 140 }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
            className="w-8 bg-neutral-300 dark:bg-neutral-700 rounded-t-lg" 
        />
        <motion.div 
            initial={{ height: 60 }}
            animate={{ height: 80 }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
            className="w-8 bg-neutral-300 dark:bg-neutral-700 rounded-t-lg" 
        />
         <motion.div 
            initial={{ height: 80 }}
            animate={{ height: 160 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="w-8 bg-neutral-300 dark:bg-neutral-700 rounded-t-lg" 
        />
    </div>
  );
};

