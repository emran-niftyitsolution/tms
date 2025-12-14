"use client";

import { Button, Input, Popconfirm, Select, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type City = {
  _id: string;
  name: string;
  code?: string;
  company: { _id: string; name: string } | null;
  status: "Active" | "Inactive";
};

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cities");
      if (res.ok) {
        const data = await res.json();
        const cityList = Array.isArray(data) ? data : [];
        setCities(cityList);
        setFilteredCities(cityList);
      }
    } catch {
      toast.error("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    let result = cities;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(lowerSearch) ||
        c.code?.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }

    setFilteredCities(result);
  }, [cities, searchText, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete city");
      toast.success("City deleted successfully");
      fetchCities();
    } catch {
      toast.error("Failed to delete city");
    }
  };

  const columns = [
    {
      title: "City Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: City) => (
        <Link
          href={`/dashboard/cities/${record._id}`}
          className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
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
      render: (company: City["company"]) => company?.name || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: City["status"]) => {
        const color = status === "Active" ? "success" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: City) => (
        <Space size="middle">
          <Link href={`/dashboard/cities/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-200 p-2 text-white transition-colors hover:bg-indigo-300 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-blue-500" />
            </button>
          </Link>
          <Popconfirm
            title="Delete the city"
            description="Are you sure to delete this city?"
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
            Cities
          </h2>
          <p className="text-sm text-slate-500">
            Manage cities and locations
          </p>
        </div>
        <Link href="/dashboard/cities/new">
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
            Add City
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          prefix={<FiSearch className="text-slate-400" />}
          placeholder="Search cities..."
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
      </div>

      <Table
        columns={columns}
        dataSource={filteredCities}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

