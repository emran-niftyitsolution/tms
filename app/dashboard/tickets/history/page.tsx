"use client";

import { Button, DatePicker, Input, Select, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiDownload, FiEye } from "react-icons/fi";
import { toast } from "sonner";
import Link from "next/link";
import { Breadcrumb } from "antd";

type Ticket = {
  _id: string;
  ticketNumber: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail?: string;
  passengerNID?: string;
  seats: Array<{
    row: number;
    column: number;
    seatNumber: number;
    seatName?: string;
    fare: number;
  }>;
  totalFare: number;
  discount: number;
  discountAmount: number;
  finalAmount: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  bookingDate: string;
  schedule?: {
    _id: string;
    number?: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    bus?: {
      _id: string;
      number: string;
      type: string;
    };
    route?: {
      _id: string;
      name: string;
      from?: { _id: string; name: string } | string;
      to?: { _id: string; name: string } | string;
    };
    company?: {
      _id: string;
      name: string;
    };
  };
  boardingPoint?: {
    _id: string;
    name: string;
  } | string;
  droppingPoint?: {
    _id: string;
    name: string;
  } | string;
};

export default function TicketHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [scheduleId, dateFilter, statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      let url = "/api/tickets";
      const params = new URLSearchParams();
      if (scheduleId) {
        params.append("scheduleId", scheduleId);
      }
      // Add includeCancelled parameter to get all tickets including cancelled ones
      params.append("includeCancelled", "true");
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let filteredTickets = Array.isArray(data) ? data : [];

        // Apply date filter
        if (dateFilter) {
          filteredTickets = filteredTickets.filter((ticket: Ticket) => {
            const bookingDate = dayjs(ticket.bookingDate);
            return bookingDate.isSame(dateFilter, "day");
          });
        }

        // Apply status filter
        if (statusFilter) {
          filteredTickets = filteredTickets.filter(
            (ticket: Ticket) => ticket.status === statusFilter
          );
        }

        setTickets(filteredTickets);
      }
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const generateAndDownloadPDF = async (ticket: Ticket) => {
    try {
      const res = await fetch("/api/tickets/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticket, schedule: ticket.schedule }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const data = await res.json();
      
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(data.html);
        printWindow.document.close();
        
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      } else {
        toast.error("Please allow popups to download the ticket");
      }
    } catch (error: any) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const columns = [
    {
      title: "Ticket Number",
      dataIndex: "ticketNumber",
      key: "ticketNumber",
      render: (text: string) => (
        <span className="font-medium text-indigo-600 dark:text-indigo-400">
          {text}
        </span>
      ),
    },
    {
      title: "Passenger",
      key: "passenger",
      render: (_: unknown, record: Ticket) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">
            {record.passengerName}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {record.passengerPhone}
          </span>
          {record.passengerEmail && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {record.passengerEmail}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_: unknown, record: Ticket) => {
        if (!record.schedule) return "-";
        const route = record.schedule.route;
        const fromName = route?.from
          ? typeof route.from === "object"
            ? route.from.name
            : route.from
          : "Unknown";
        const toName = route?.to
          ? typeof route.to === "object"
            ? route.to.name
            : route.to
          : "Unknown";
        return (
          <div className="flex flex-col">
            <span className="font-medium text-slate-900 dark:text-white">
              {route?.name || `${fromName} → ${toName}`}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {dayjs(record.schedule.departureTime).format("MMM D, YYYY h:mm A")}
            </span>
            {record.schedule.bus && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Bus: {record.schedule.bus.number} ({record.schedule.bus.type})
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Seats",
      key: "seats",
      render: (_: unknown, record: Ticket) => (
        <div className="flex flex-wrap gap-1">
          {record.seats.map((seat, idx) => (
            <Tag key={idx} color="blue">
              {seat.seatName || `Seat ${seat.seatNumber}`}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Boarding/Dropping",
      key: "points",
      render: (_: unknown, record: Ticket) => {
        const boardingName =
          typeof record.boardingPoint === "object"
            ? record.boardingPoint?.name
            : record.boardingPoint || "-";
        const droppingName =
          typeof record.droppingPoint === "object"
            ? record.droppingPoint?.name
            : record.droppingPoint || "-";
        return (
          <div className="flex flex-col text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              From: {boardingName}
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              To: {droppingName}
            </span>
          </div>
        );
      },
    },
    {
      title: "Amount",
      key: "amount",
      render: (_: unknown, record: Ticket) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">
            ৳{record.finalAmount.toLocaleString()}
          </span>
          {record.discount > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Discount: {record.discount}%
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Ticket["status"]) => {
        let color = "default";
        if (status === "Confirmed") color = "success";
        if (status === "Pending") color = "warning";
        if (status === "Cancelled") color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (text: string) => dayjs(text).format("MMM D, YYYY h:mm A"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: Ticket) => (
        <Space>
          <Button
            type="link"
            icon={<FiDownload />}
            onClick={() => generateAndDownloadPDF(record)}
            size="small"
          >
            PDF
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/tickets">Tickets</Link> },
          { title: "Ticket History" },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ticket History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {scheduleId
              ? "View all tickets for this schedule"
              : "View all ticket bookings and transactions"}
          </p>
        </div>
        <Button
          icon={<FiArrowLeft />}
          onClick={() => router.push("/dashboard/tickets")}
          className="rounded-lg"
        >
          Back to Tickets
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Booking Date
            </label>
            <DatePicker
              value={dateFilter}
              onChange={(date) => setDateFilter(date)}
              placeholder="Filter by date"
              className="w-full"
              allowClear
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              placeholder="Filter by status"
              className="w-full"
              allowClear
              options={[
                { label: "Pending", value: "Pending" },
                { label: "Confirmed", value: "Confirmed" },
                { label: "Cancelled", value: "Cancelled" },
              ]}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setDateFilter(null);
                setStatusFilter(null);
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: true }}
        />
      </div>
    </div>
  );
}

