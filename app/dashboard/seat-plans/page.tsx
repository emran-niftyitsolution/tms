"use client";

import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type SeatPlan = {
  _id: string;
  name: string;
  type: string;
  rows: number;
  columns: number;
  seats: Array<{ row: number; column: number; seatNumber: number; isAisle?: boolean }>;
  totalSeats?: number;
  company: { _id: string; name: string } | null;
  status: "Active" | "Inactive";
};

export default function SeatPlansPage() {
  const [plans, setPlans] = useState<SeatPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SeatPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seat-plans");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setPlans(list);
        setFilteredPlans(list);
      }
    } catch {
      toast.error("Failed to load seat plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    let result = plans;
    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.type.toLowerCase().includes(lower) ||
          (p.company?.name || "").toLowerCase().includes(lower)
      );
    }
    setFilteredPlans(result);
  }, [plans, searchText]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/seat-plans/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete seat plan");
      toast.success("Seat plan deleted successfully");
      fetchPlans();
    } catch {
      toast.error("Failed to delete seat plan");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: SeatPlan) => (
        <Link
          href={`/dashboard/seat-plans/${record._id}`}
          className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: SeatPlan["company"]) => company?.name || "-",
    },
    {
      title: "Bus Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: "Rows",
      dataIndex: "rows",
      key: "rows",
    },
    {
      title: "Columns",
      dataIndex: "columns",
      key: "columns",
    },
    {
      title: "Total Seats",
      key: "totalSeats",
      render: (_: unknown, record: SeatPlan) => {
        // Calculate total seats from seats array (excluding road seats)
        const totalSeats = record.seats
          ? record.seats.filter((s) => !s.isAisle).length
          : record.totalSeats || 0;
        return totalSeats;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "success" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: SeatPlan) => (
        <Space size="middle">
          <Link href={`/dashboard/seat-plans/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-200 p-2 text-white transition-colors hover:bg-indigo-300 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-blue-500" />
            </button>
          </Link>
          <Popconfirm
            title="Delete seat plan"
            description="Are you sure you want to delete this seat plan?"
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
            Seat Plans
          </h2>
          <p className="text-sm text-slate-500">Manage bus seat configurations</p>
        </div>
        <Link href="/dashboard/seat-plans/new">
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
            Add Seat Plan
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Input
          prefix={<FiSearch className="text-slate-400" />}
          placeholder="Search plans..."
          className="rounded-lg"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredPlans}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}


