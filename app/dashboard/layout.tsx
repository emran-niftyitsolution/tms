import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { ReactNode } from "react";
import "antd/dist/reset.css";
import DashboardShell from "./DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <DashboardShell>{children}</DashboardShell>
    </AntdRegistry>
  );
}


