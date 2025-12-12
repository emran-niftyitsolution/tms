"use client";

import { Button, Table, Tag } from "antd";

type Company = {
  key: string;
  name: string;
  type: "Bus" | "Train" | "Air" | "Ship";
  routes: number;
  status: "Active" | "Pending" | "Inactive";
};

const companies: Company[] = [
  {
    key: "1",
    name: "SkyWings Airlines",
    type: "Air",
    routes: 24,
    status: "Active",
  },
  {
    key: "2",
    name: "Green Line Paribahan",
    type: "Bus",
    routes: 18,
    status: "Active",
  },
  {
    key: "3",
    name: "Bangladesh Railway",
    type: "Train",
    routes: 42,
    status: "Active",
  },
  {
    key: "4",
    name: "Sundarban Courier",
    type: "Ship",
    routes: 6,
    status: "Pending",
  },
  {
    key: "5",
    name: "Hanif Enterprise",
    type: "Bus",
    routes: 32,
    status: "Active",
  },
  {
    key: "6",
    name: "US-Bangla Airlines",
    type: "Air",
    routes: 12,
    status: "Inactive",
  },
];

const columns = [
  {
    title: "Company Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type: Company["type"]) => {
      const colors: Record<Company["type"], string> = {
        Bus: "green",
        Train: "blue",
        Air: "purple",
        Ship: "orange",
      };
      return <Tag color={colors[type]}>{type}</Tag>;
    },
  },
  {
    title: "Routes",
    dataIndex: "routes",
    key: "routes",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: Company["status"]) => {
      const colors: Record<Company["status"], string> = {
        Active: "green",
        Pending: "gold",
        Inactive: "red",
      };
      return <Tag color={colors[status]}>{status}</Tag>;
    },
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Button type="link" size="small">
        View
      </Button>
    ),
  },
];

export default function CompaniesPage() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            Companies
          </h2>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Manage transport operators and partners
          </p>
        </div>
        <Button type="primary">Add Company</Button>
      </div>

      <Table
        columns={columns}
        dataSource={companies}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
