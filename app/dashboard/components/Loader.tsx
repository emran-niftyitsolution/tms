"use client";

import { Spin } from "antd";

export function FormLoader({ 
  children, 
  loading 
}: { 
  children: React.ReactNode;
  loading: boolean;
}) {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[200px]">
      <div className="pointer-events-none opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-800/60 dark:bg-slate-900/60 z-10 rounded-lg">
        <Spin size="large" />
      </div>
    </div>
  );
}

