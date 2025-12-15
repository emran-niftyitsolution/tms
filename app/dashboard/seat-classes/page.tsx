"use client";

import { Button, Input, Popconfirm, Select, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type SeatClass = {
  _id: string;
  name: string;
  fare: number;
  company: { _id: string; name: string } | null;
  status: "Active" | "Inactive";
};

export default function SeatClassesPage() {
  const [seatClasses, setSeatClasses] = useState<SeatClass[]>([]);
  const [filteredSeatClasses, setFilteredSeatClasses] = useState<SeatClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchSeatClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seat-classes");
      if (res.ok) {
        const data = await res.json();
        const seatClassList = Array.isArray(data) ? data : [];
        setSeatClasses(seatClassList);
        setFilteredSeatClasses(seatClassList);
      }
    } catch {
      toast.error("Failed to load seat classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatClasses();
  }, []);

  useEffect(() => {
    let result = seatClasses;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter((sc) =>
        sc.name.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter) {
      result = result.filter((sc) => sc.status === statusFilter);
    }

    setFilteredSeatClasses(result);
  }, [seatClasses, searchText, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/seat-classes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete seat class");
      toast.success("Seat class deleted successfully");
      fetchSeatClasses();
    } catch {
      toast.error("Failed to delete seat class");
    }
  };

  const columns = [
    {
      title: "Seat Class Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: SeatClass) => (
        <Link
          href={`/dashboard/seat-classes/${record._id}`}
          className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:text-white"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: SeatClass["company"]) => company?.name || "-",
    },
    {
      title: "Fare",
      dataIndex: "fare",
      key: "fare",
      render: (fare: number) => (
        <span className="font-medium">৳{fare?.toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: SeatClass["status"]) => {
        const color = status === "Active" ? "success" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: SeatClass) => (
        <Space size="middle">
          <Link href={`/dashboard/seat-classes/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-200 p-2 text-white transition-colors hover:bg-indigo-300 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-blue-500" />
            </button>
          </Link>
          <Popconfirm
            title="Delete the seat class"
            description="Are you sure to delete this seat class?"
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
            Seat Classes
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage seat class configurations
          </p>
        </div>
        <Link href="/dashboard/seat-classes/new">
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
            Add Seat Class
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          prefix={<FiSearch className="text-slate-400 dark:text-white dark:text-slate-300" />}
          placeholder="Search seat classes..."
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
        dataSource={filteredSeatClasses}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

