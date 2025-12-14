"use client";

import { Button, Table, Tag } from "antd";
import Link from "next/link";
import { FiPlus, FiExternalLink } from "react-icons/fi";
import dayjs from "dayjs";

interface RouteSchedulesTabProps {
  schedules: any[];
  routeId: string;
}

export function RouteSchedulesTab({ schedules, routeId }: RouteSchedulesTabProps) {
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
          <span className="text-xs text-slate-500">
            {dayjs(text).format("h:mm A")}
          </span>
        </div>
      ),
    },
    {
      title: "Bus",
      dataIndex: "bus",
      key: "bus",
      render: (bus: any) => (
        bus ? (
          <Link
            href={`/dashboard/buses/${bus._id}`}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
          >
            <span className="font-medium">{bus.number}</span>
            <span className="text-xs text-slate-500">({bus.type})</span>
            <FiExternalLink className="text-xs" />
          </Link>
        ) : "-"
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="font-medium">৳{price?.toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          Scheduled: "blue",
          Delayed: "warning",
          Completed: "success",
          Cancelled: "error",
        };
        return <Tag color={colors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: any) => (
        <Link href={`/dashboard/schedules/${record._id}`}>
          <Button type="link" size="small">View Details</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trip Schedules</h3>
        <Link href={`/dashboard/schedules/new?routeId=${routeId}`}>
          <Button type="primary" icon={<FiPlus />}>Create Schedule</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={schedules}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "No schedules found. Create the first schedule for this route." }}
      />
    </div>
  );
}


