"use client";

import { Button, Input, Popconfirm, Select, Space, Switch, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Stoppage = {
  _id: string;
  name: string;
  code?: string;
  company: { _id: string; name: string } | null;
  city: { 
    _id: string; 
    name: string; 
    company?: { _id: string; name: string } | null;
    status?: string;
  } | null;
  boarding: boolean;
  dropping: boolean;
  counter: boolean;
  status: "Active" | "Inactive";
};

export default function StoppagesPage() {
  const [stoppages, setStoppages] = useState<Stoppage[]>([]);
  const [filteredStoppages, setFilteredStoppages] = useState<Stoppage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [boardingFilter, setBoardingFilter] = useState<boolean | null>(null);
  const [droppingFilter, setDroppingFilter] = useState<boolean | null>(null);
  const [counterFilter, setCounterFilter] = useState<boolean | null>(null);

  const fetchStoppages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stoppages");
      if (res.ok) {
        const data = await res.json();
        const stoppageList = Array.isArray(data) ? data : [];
        setStoppages(stoppageList);
        setFilteredStoppages(stoppageList);
      }
    } catch {
      toast.error("Failed to load stoppages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoppages();
  }, []);

  useEffect(() => {
    let result = stoppages;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerSearch) ||
          s.code?.toLowerCase().includes(lowerSearch) ||
          s.city?.name.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (boardingFilter !== null) {
      result = result.filter((s) => s.boarding === boardingFilter);
    }

    if (droppingFilter !== null) {
      result = result.filter((s) => s.dropping === droppingFilter);
    }

    if (counterFilter !== null) {
      result = result.filter((s) => s.counter === counterFilter);
    }

    setFilteredStoppages(result);
  }, [stoppages, searchText, statusFilter, boardingFilter, droppingFilter, counterFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/stoppages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete stoppage");
      toast.success("Stoppage deleted successfully");
      fetchStoppages();
    } catch {
      toast.error("Failed to delete stoppage");
    }
  };

  const columns = [
    {
      title: "Stoppage Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Stoppage) => (
        <Link
          href={`/dashboard/stoppages/${record._id}`}
          className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:text-white"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => code || "-",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: Stoppage["company"]) => company?.name || "-",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (city: Stoppage["city"]) => (
        <div className="font-medium">{city?.name || "-"}</div>
      ),
    },
    {
      title: "Boarding",
      dataIndex: "boarding",
      key: "boarding",
      render: (enabled: boolean) => (
        <Tag color={enabled ? "success" : "default"}>
          {enabled ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Dropping",
      dataIndex: "dropping",
      key: "dropping",
      render: (enabled: boolean) => (
        <Tag color={enabled ? "success" : "default"}>
          {enabled ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Counter",
      dataIndex: "counter",
      key: "counter",
      render: (enabled: boolean) => (
        <Tag color={enabled ? "success" : "default"}>
          {enabled ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Stoppage["status"]) => {
        const color = status === "Active" ? "success" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Stoppage) => (
        <Space size="middle">
          <Link href={`/dashboard/stoppages/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-200 p-2 text-white transition-colors hover:bg-indigo-300 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-blue-500" />
            </button>
          </Link>
          <Popconfirm
            title="Delete the stoppage"
            description="Are you sure to delete this stoppage?"
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
            Stoppages
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage boarding and dropping points
          </p>
        </div>
        <Link href="/dashboard/stoppages/new">
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
            Add Stoppage
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          prefix={<FiSearch className="text-slate-400 dark:text-white dark:text-slate-300" />}
          placeholder="Search stoppages..."
          className="rounded-lg"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
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
        <Select
          placeholder="Boarding"
          allowClear
          className="rounded-lg"
          style={{ width: 130 }}
          onChange={(value) => setBoardingFilter(value)}
          options={[
            { label: "Enabled", value: true },
            { label: "Disabled", value: false },
          ]}
        />
        <Select
          placeholder="Dropping"
          allowClear
          className="rounded-lg"
          style={{ width: 130 }}
          onChange={(value) => setDroppingFilter(value)}
          options={[
            { label: "Enabled", value: true },
            { label: "Disabled", value: false },
          ]}
        />
        <Select
          placeholder="Counter"
          allowClear
          className="rounded-lg"
          style={{ width: 130 }}
          onChange={(value) => setCounterFilter(value)}
          options={[
            { label: "Enabled", value: true },
            { label: "Disabled", value: false },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredStoppages}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

