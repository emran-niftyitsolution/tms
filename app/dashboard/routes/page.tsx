"use client";

import { Button, Input, Popconfirm, Select, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Route = {
  _id: string;
  name: string;
  from: { _id: string; name: string; code?: string } | string;
  to: { _id: string; name: string; code?: string } | string;
  company: { _id: string; name: string } | null;
  status: "Active" | "Inactive";
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>(
    []
  );

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const [routesRes, companiesRes] = await Promise.all([
        fetch("/api/routes"),
        fetch("/api/companies"),
      ]);

      if (routesRes.ok) {
        const data = await routesRes.json();
        const routeList = Array.isArray(data) ? data : [];
        setRoutes(routeList);
        setFilteredRoutes(routeList);
      }

      if (companiesRes.ok) {
        const data = await companiesRes.json();
        setCompanies(
          Array.isArray(data)
            ? data.map((c: any) => ({ label: c.name, value: c.name }))
            : []
        );
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    let result = routes;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter((r) => {
        const fromName =
          typeof r.from === "object" ? r.from.name : r.from;
        const toName = typeof r.to === "object" ? r.to.name : r.to;
        return (
          r.name.toLowerCase().includes(lowerSearch) ||
          fromName.toLowerCase().includes(lowerSearch) ||
          toName.toLowerCase().includes(lowerSearch)
        );
      });
    }

    if (companyFilter) {
      result = result.filter((r) => r.company?.name === companyFilter);
    }

    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    setFilteredRoutes(result);
  }, [routes, searchText, companyFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/routes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete route");
      toast.success("Route deleted successfully");
      fetchRoutes();
    } catch {
      toast.error("Failed to delete route");
    }
  };

  const columns = [
    {
      title: "Route Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Route) => (
        <div>
          <Link
            href={`/dashboard/routes/${record._id}`}
            className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white block"
          >
            {text}
          </Link>
          <Link
            href={`/dashboard/schedules/new?routeId=${record._id}`}
            className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 inline-block"
          >
            Create Schedule →
          </Link>
        </div>
      ),
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      render: (from: Route["from"]) =>
        typeof from === "object" ? from.name : from,
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      render: (to: Route["to"]) => (typeof to === "object" ? to.name : to),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: Route["company"]) => company?.name || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Route["status"]) => {
        const color = status === "Active" ? "success" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Route) => (
        <Space size="middle">
          <Link href={`/dashboard/routes/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-200 p-2 text-white transition-colors hover:bg-indigo-300 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-blue-500" />
            </button>
          </Link>
          <Popconfirm
            title="Delete the route"
            description="Are you sure to delete this route?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              title="Delete"
            >
              <FiTrash2 className="h-4 w-4 text-white" />
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Routes
          </h2>
          <p className="text-sm text-slate-500">
            Manage your transport routes
          </p>
        </div>
        <Link href="/dashboard/routes/new">
          <Button
            type="primary"
            icon={<FiPlus />}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
              height: 40,
              borderRadius: 8,
              fontWeight: 600,
              paddingInline: 24,
            }}
          >
            Add Route
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          prefix={<FiSearch className="text-slate-400" />}
          placeholder="Search routes..."
          className="rounded-lg"
          style={{ width: 250 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Company"
          allowClear
          className="rounded-lg"
          style={{ width: 200 }}
          onChange={(value) => setCompanyFilter(value)}
          options={companies}
          showSearch
          optionFilterProp="label"
        />
        <Select
          placeholder="Status"
          allowClear
          className="rounded-lg"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredRoutes}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}

