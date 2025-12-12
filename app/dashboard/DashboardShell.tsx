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
import { signOut, useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();

  const { token } = theme.useToken();
  const siderWidth = collapsed ? 80 : 260;

  const breadcrumbItems = useMemo(() => {
    const base = [{ title: "Dashboard" }];
    if (activeKey === "companies") return [...base, { title: "Companies" }];
    return base;
  }, [activeKey]);

  const userInitials = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "G";

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
          background: "#0f172a", // Slate 900
          borderRight: "1px solid #1e293b", // Slate 800
        }}
      >
        <div style={{ padding: 24 }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                color: "white",
                background: "#6366f1", // Indigo 500
                fontSize: 18,
              }}
            >
              T
            </div>
            {!collapsed ? (
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>TMS Portal</div>
              </div>
            ) : null}
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          style={{ borderRight: 0, background: "transparent" }}
          items={[
            {
              key: "dashboard",
              icon: <LuLayoutDashboard size={20} />,
              label: <Link href="/dashboard">Overview</Link>,
            },
            {
              key: "companies",
              icon: <LuBuilding2 size={20} />,
              label: <Link href="/dashboard/companies">Companies</Link>,
            },
          ]}
        />
      </Sider>

      <Layout style={{ marginInlineStart: siderWidth, transition: "all 0.2s" }}>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            padding: "0 24px",
            background: "#ffffff",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <Button
            type="text"
            aria-label="Toggle sidebar"
            icon={<FiMenu size={20} />}
            onClick={() => setCollapsed((v) => !v)}
            style={{ marginLeft: -8 }}
          />

          <Dropdown
            menu={{
              items: [
                { key: "profile", label: "Profile" },
                { key: "settings", label: "Settings" },
                { type: "divider" },
                {
                  key: "logout",
                  label: "Logout",
                  onClick: () => signOut({ callbackUrl: "/login" }),
                },
              ],
            }}
            trigger={["click"]}
            overlayStyle={{ minWidth: 160 }}
          >
            <Button
              type="text"
              aria-label="Open profile menu"
              style={{ paddingInline: 8, height: 40 }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="text-right hidden sm:block">
                  <div
                    style={{
                      fontWeight: 600,
                      color: token.colorText,
                      fontSize: 13,
                      lineHeight: 1.2,
                    }}
                  >
                    {status === "loading"
                      ? "Loading..."
                      : session?.user?.name || "Guest"}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: token.colorTextSecondary,
                      lineHeight: 1.2,
                    }}
                  >
                    {status === "loading" ? "..." : "Admin"}
                  </div>
                </div>
                <Avatar
                  size="default"
                  src={session?.user?.image}
                  style={{
                    background: "#e0e7ff",
                    color: "#4f46e5",
                    verticalAlign: "middle",
                    border: "2px solid #fff",
                    boxShadow: "0 0 0 1px #e2e8f0",
                  }}
                >
                  {userInitials}
                </Avatar>
              </span>
            </Button>
          </Dropdown>
        </Header>

        <Content
          style={{
            padding: "24px",
            width: "100%",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div
            style={{
              minHeight: "calc(100vh - 160px)",
            }}
          >
            {children}
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            color: token.colorTextSecondary,
            background: "transparent",
            padding: "24px 0",
          }}
        >
          © {new Date().getFullYear()} TMS Portal
        </Footer>
      </Layout>
    </Layout>
  );
}
