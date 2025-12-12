"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiGithub, FiLock, FiMail, FiUser } from "react-icons/fi";

export default function RegisterPage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline transition-all"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8"
      >
        <div className="grid gap-6">
          <form action="#" method="POST">
            <div className="space-y-6">
              <div className="group relative">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1"
                >
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-4 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full rounded-2xl border-0 bg-slate-50/50 py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:bg-white/10 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="group relative">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1"
                >
                  Email address
                </label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-4 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-2xl border-0 bg-slate-50/50 py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:bg-white/10 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="group relative">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-2xl border-0 bg-slate-50/50 py-4 pl-12 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:bg-white/10 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all"
                >
                  Sign up
                </motion.button>
              </div>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500 dark:bg-black">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <motion.a
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              href="#"
              className="relative flex items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:hover:bg-white/10 transition-all"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              href="#"
              className="relative flex items-center justify-center gap-3 rounded-2xl bg-[#24292F] px-4 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#24292F]/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-all"
            >
              <FiGithub className="h-5 w-5" />
              Sign up with GitHub
            </motion.a>
          </div>
        </div>
      </motion.div>
    </>
  );
}
