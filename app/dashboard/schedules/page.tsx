"use client";

import {
  Button,
  DatePicker,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Schedule = {
  _id: string;
  company: { _id: string; name: string } | null;
  bus: { _id: string; number: string; type: string } | null;
  route: {
    _id: string;
    name: string;
    from: { _id: string; name: string } | string;
    to: { _id: string; name: string } | string;
  } | null;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: "Scheduled" | "Delayed" | "Completed" | "Cancelled";
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedules");
      if (res.ok) {
        const data = await res.json();
        const scheduleList = Array.isArray(data) ? data : [];
        setSchedules(scheduleList);
        setFilteredSchedules(scheduleList);
      }
    } catch {
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    let result = schedules;

    if (dateFilter) {
      result = result.filter((s) =>
        dayjs(s.departureTime).isSame(dateFilter, "day")
      );
    }

    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }

    setFilteredSchedules(result);
  }, [schedules, dateFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete schedule");
      toast.success("Schedule deleted successfully");
      fetchSchedules();
    } catch {
      toast.error("Failed to delete schedule");
    }
  };

  const columns = [
    {
      title: "Departure",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (text: string) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">
            {dayjs(text).format("MMM D, YYYY")}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {dayjs(text).format("h:mm A")}
          </span>
        </div>
      ),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: Schedule["company"]) => company?.name || "-",
    },
    {
      title: "Bus",
      dataIndex: "bus",
      key: "bus",
      render: (bus: Schedule["bus"]) =>
        bus ? (
          <Link
            href={`/dashboard/buses/${bus._id}`}
            className="flex flex-col text-indigo-600 hover:text-indigo-700"
          >
            <span className="font-medium">{bus.number}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {bus.type}
            </span>
          </Link>
        ) : (
          <div className="flex flex-col">
            <span className="font-medium">-</span>
          </div>
        ),
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
      render: (route: Schedule["route"]) =>
        route ? (
          <Link
            href={`/dashboard/routes/${route._id}`}
            className="flex flex-col text-indigo-600 hover:text-indigo-700"
          >
            <span className="font-medium">{route.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {typeof route.from === "object" ? route.from.name : route.from} -{" "}
              {typeof route.to === "object" ? route.to.name : route.to}
            </span>
          </Link>
        ) : (
          <div className="flex flex-col">
            <span className="font-medium">-</span>
          </div>
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span className="font-medium">৳{price}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Schedule["status"]) => {
        let color = "default";
        if (status === "Scheduled") color = "blue";
        if (status === "Delayed") color = "warning";
        if (status === "Completed") color = "success";
        if (status === "Cancelled") color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Schedule) => (
        <Space size="middle">
          <Link href={`/dashboard/schedules/${record._id}`}>
            <button
              className="flex cursor-pointer items-center justify-center rounded-full bg-indigo-200 p-2 text-white transition-colors hover:bg-indigo-300 dark:bg-indigo-500/40 dark:hover:bg-indigo-500/60"
              title="Edit"
            >
              <FiEdit2 className="h-4 w-4 text-blue-500" />
            </button>
          </Link>
          <Popconfirm
            title="Delete the schedule"
            description="Are you sure to delete this schedule?"
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
            Schedules
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage trip schedules and pricing
          </p>
        </div>
        <Link href="/dashboard/schedules/new">
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
            Add Schedule
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <DatePicker
          placeholder="Filter Date"
          className="rounded-lg"
          style={{ width: 200 }}
          onChange={(date) => setDateFilter(date)}
        />
        <Select
          placeholder="Status"
          allowClear
          className="rounded-lg"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { label: "Scheduled", value: "Scheduled" },
            { label: "Delayed", value: "Delayed" },
            { label: "Completed", value: "Completed" },
            { label: "Cancelled", value: "Cancelled" },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredSchedules}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}
