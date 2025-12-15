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
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { FiBriefcase, FiMenu, FiUsers, FiMoon, FiSun } from "react-icons/fi";
import {
  LuBuilding2,
  LuBus,
  LuLayoutDashboard,
  LuPlane,
  LuRoute,
  LuShip,
} from "react-icons/lu";

const { Header, Sider, Content, Footer } = Layout;

type MenuKey =
  | "dashboard"
  | "companies"
  | "users"
  | "staff"
  | "cities"
  | "stoppages"
  | "buses"
  | "routes"
  | "schedules"
  | "employees"
  | "seat-classes"
  | "fares"
  | "seat-plans"
  | "ships"
  | "trains"
  | "flights";

function getActiveKey(pathname: string): MenuKey {
  if (pathname.startsWith("/dashboard/companies")) return "companies";
  if (pathname.startsWith("/dashboard/users")) return "users";
  if (pathname.startsWith("/dashboard/staff")) return "staff";

  // Bus Management
  if (pathname.startsWith("/dashboard/cities")) return "cities";
  if (pathname.startsWith("/dashboard/stoppages")) return "stoppages";
  if (pathname.startsWith("/dashboard/buses")) return "buses";
  if (pathname.startsWith("/dashboard/routes")) return "routes";
  if (pathname.startsWith("/dashboard/schedules")) return "schedules";
  if (pathname.startsWith("/dashboard/employees")) return "employees";
  if (pathname.startsWith("/dashboard/seat-classes")) return "seat-classes";
  if (pathname.startsWith("/dashboard/fares")) return "fares";
  if (pathname.startsWith("/dashboard/seat-plans")) return "seat-plans";

  // Other Modes
  if (pathname.startsWith("/dashboard/ships")) return "ships";
  if (pathname.startsWith("/dashboard/trains")) return "trains";
  if (pathname.startsWith("/dashboard/flights")) return "flights";

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
  const { theme: currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { token } = theme.useToken();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  const siderWidth = collapsed ? 80 : 260;

  const breadcrumbItems = useMemo(() => {
    // Split pathname into segments
    const segments = pathname.split("/").filter(Boolean);

    // Map segments to breadcrumb items
    const items = segments.map((segment, index) => {
      // Build the url for this segment
      const url = `/${segments.slice(0, index + 1).join("/")}`;

      // Capitalize and format the title
      const title =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      // If it's the last item, it shouldn't be a link
      const isLast = index === segments.length - 1;

      return {
        title: isLast ? title : <Link href={url}>{title}</Link>,
      };
    });

    // Always keep Dashboard as the root if we are in /dashboard,
    // but the split logic handles "dashboard" as the first segment naturally.
    // If you want "Home" > "Dashboard" structure, you can prepend it.

    // Antd breadcrumb expects `title` which can be a ReactNode
    return items;
  }, [pathname]);

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
            {
              key: "users",
              icon: <FiUsers size={20} />,
              label: <Link href="/dashboard/users">Users</Link>,
            },
            {
              key: "staff",
              icon: <FiBriefcase size={20} />,
              label: <Link href="/dashboard/staff">Staff & Crew</Link>,
            },
            {
              type: "divider",
            },
            {
              key: "bus-management",
              icon: <LuBus size={20} />,
              label: "Bus Management",
              children: [
                {
                  key: "cities",
                  label: <Link href="/dashboard/cities">Cities</Link>,
                },
                {
                  key: "stoppages",
                  label: <Link href="/dashboard/stoppages">Stoppages</Link>,
                },
                {
                  key: "routes",
                  label: <Link href="/dashboard/routes">Routes</Link>,
                },
                {
                  key: "seat-classes",
                  label: (
                    <Link href="/dashboard/seat-classes">Seat Classes</Link>
                  ),
                },
                {
                  key: "fares",
                  label: <Link href="/dashboard/fares">Fares</Link>,
                },
                {
                  key: "seat-plans",
                  label: <Link href="/dashboard/seat-plans">Seat Plans</Link>,
                },
                {
                  key: "buses",
                  label: <Link href="/dashboard/buses">Fleet (Buses)</Link>,
                },
                {
                  key: "schedules",
                  label: (
                    <Link href="/dashboard/schedules">Schedules (Trips)</Link>
                  ),
                },
                {
                  key: "employees",
                  label: <Link href="/dashboard/employees">Staff</Link>,
                },
              ],
            },
            {
              key: "ship-management",
              icon: <LuShip size={20} />,
              label: "Ship Management",
              children: [
                { key: "ships", label: "Fleet (Ships)" },
                { key: "ship-routes", label: "Routes" },
                { key: "ship-schedules", label: "Schedules" },
                { key: "terminals", label: "Terminals" },
                { key: "cabins", label: "Cabin/Seat Plans" },
              ],
            },
            {
              key: "train-management",
              icon: <LuRoute size={20} />,
              label: "Train Management",
              children: [
                { key: "trains", label: "Fleet (Trains)" },
                { key: "train-routes", label: "Routes" },
                { key: "train-schedules", label: "Schedules" },
                { key: "stations", label: "Stations" },
                { key: "coaches", label: "Coach Config" },
              ],
            },
            {
              key: "air-management",
              icon: <LuPlane size={20} />,
              label: "Flight Management",
              children: [
                { key: "flights", label: "Aircrafts" },
                { key: "flight-routes", label: "Routes" },
                { key: "flight-schedules", label: "Schedules" },
                { key: "airports", label: "Airports" },
              ],
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
            icon={<FiMenu/>}
            onClick={() => setCollapsed((v) => !v)}
            style={{
              marginLeft: -24,
							fontSize: '24px',
              width: 64,
              height: 64,
            }}
          />

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            {mounted && (
              <Button
                type="text"
                aria-label="Toggle dark mode"
                icon={currentTheme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
                onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                style={{
                  paddingInline: 12,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}

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
              className: "min-w-[160px]",
            }}
            trigger={["click"]}
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
          </div>
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
