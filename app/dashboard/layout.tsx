import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import type { ReactNode } from "react";
import DashboardShell from "./DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#6366f1", // Indigo 500
            borderRadius: 10,
            fontFamily: "var(--font-geist-sans)",
            colorBgContainer: "#ffffff",
            colorBgLayout: "#f8fafc", // Slate 50
          },
          components: {
            Layout: {
              bodyBg: "#f8fafc",
              headerBg: "#ffffff",
              siderBg: "#0f172a", // Slate 900
            },
            Menu: {
              // Light theme defaults (unused in sidebar now, but good for dropdowns)
              itemSelectedBg: "#eff6ff",
              itemSelectedColor: "#4f46e5",
              itemColor: "#64748b",
              itemBorderRadius: 8,
              itemMarginInline: 12,
              iconSize: 18,

              // Dark theme overrides (for Sidebar)
              darkItemBg: "transparent",
              darkItemSelectedBg: "#6366f1", // Indigo 500
              darkItemSelectedColor: "#ffffff",
              darkItemColor: "#94a3b8", // Slate 400
              darkItemHoverColor: "#ffffff",
            },
            Button: {
              fontWeight: 500,
              primaryShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.3)",
            },
            Table: {
              headerBg: "#f8fafc",
              headerColor: "#64748b",
              headerSplitColor: "transparent",
              rowHoverBg: "#f8fafc",
            },
          },
        }}
      >
        <DashboardShell>{children}</DashboardShell>
      </ConfigProvider>
    </AntdRegistry>
  );
}
