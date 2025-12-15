export function DashboardFooter() {
  return (
    <footer className="mt-6 rounded-2xl border border-slate-200/70 bg-white dark:bg-slate-800/60 p-4 text-sm text-slate-600 dark:text-white backdrop-blur dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} TMS Tickets — Portal</span>
        <span>Next.js + Tailwind</span>
      </div>
    </footer>
  );
}


