"use client";

import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  Menu,
  theme,
} from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { LuBuilding2, LuLayoutDashboard } from "react-icons/lu";

const { Header, Sider, Content, Footer } = Layout;

type MenuKey = "dashboard" | "companies";

function getActiveKey(pathname: string): MenuKey {
  if (pathname.startsWith("/dashboard/companies")) return "companies";
  return "dashboard";
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeKey = getActiveKey(pathname);
  const [collapsed, setCollapsed] = useState(false);

  const { token } = theme.useToken();
  const siderWidth = collapsed ? 80 : 260;

  const breadcrumbItems = useMemo(() => {
    const base = [{ title: "Dashboard" }];
    if (activeKey === "companies") return [...base, { title: "Companies" }];
    return base;
  }, [activeKey]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={260}
        style={{
          position: "fixed",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          overflow: "auto",
          zIndex: 20,
          background: token.colorBgElevated,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div style={{ padding: 16 }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: token.colorText,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                color: "white",
                background:
                  "linear-gradient(135deg, rgb(99,102,241), rgb(34,211,238))",
              }}
            >
              T
            </div>
            {!collapsed ? (
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontWeight: 700 }}>TMS Portal</div>
                <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
                  Admin dashboard
                </div>
              </div>
            ) : null}
          </Link>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          style={{ borderRight: 0 }}
          items={[
            {
              key: "dashboard",
              icon: <LuLayoutDashboard size={18} />,
              label: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              key: "companies",
              icon: <LuBuilding2 size={18} />,
              label: <Link href="/dashboard/companies">Companies</Link>,
            },
          ]}
        />
      </Sider>

      <Layout style={{ marginInlineStart: siderWidth }}>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            padding: "0 16px",
            background: "#ffffff",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            aria-label="Toggle sidebar"
            icon={<FiMenu />}
            onClick={() => setCollapsed((v) => !v)}
          />

          <Dropdown
            menu={{
              items: [
                { key: "profile", label: "Profile" },
                { key: "settings", label: "Settings" },
                { type: "divider" },
                { key: "logout", label: "Logout" },
              ],
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              aria-label="Open profile menu"
              style={{ paddingInline: 10 }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar
                  size="small"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(99,102,241), rgb(34,211,238))",
                  }}
                >
                  A
                </Avatar>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: 1.1,
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontWeight: 700, color: token.colorText }}>
                    Admin
                  </span>
                  <span
                    style={{ fontSize: 12, color: token.colorTextSecondary }}
                  >
                    admin@tms.com
                  </span>
                </span>
              </span>
            </Button>
          </Dropdown>
        </Header>

        <Content style={{ padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div
            style={{
              borderRadius: 14,
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              padding: 16,
              minHeight: "calc(100vh - 160px)",
            }}
          >
            {children}
          </div>
        </Content>

        <Footer
          style={{ textAlign: "center", color: token.colorTextSecondary }}
        >
          © {new Date().getFullYear()} TMS Portal • Next.js + Ant Design
        </Footer>
      </Layout>
    </Layout>
  );
}
