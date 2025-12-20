"use client";

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCopy, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

type Schedule = {
  _id: string;
  number?: string;
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
  seats?: any[];
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [copyScheduleData, setCopyScheduleData] = useState<Schedule | null>(null);
  const [copyLoading, setCopyLoading] = useState(false);

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

  const handleCopy = async (schedule: Schedule) => {
    // Open modal immediately
    setCopyModalVisible(true);
    setCopyLoading(true);
    setCopyScheduleData(null);
    
    try {
      // Fetch full schedule details including seats
      const res = await fetch(`/api/schedules/${schedule._id}`);
      if (!res.ok) throw new Error("Failed to fetch schedule details");
      const scheduleData = await res.json();
      setCopyScheduleData(scheduleData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load schedule details");
      setCopyModalVisible(false);
    } finally {
      setCopyLoading(false);
    }
  };

  const handleCopySubmit = async (values: any) => {
    if (!copyScheduleData) return;
    
    setCopyLoading(true);
    try {
      // Convert date objects to ISO strings if they exist
      const payload: any = { ...values };
      if (payload.departureTime && payload.departureTime.toISOString) {
        payload.departureTime = payload.departureTime.toISOString();
      }
      if (payload.arrivalTime && payload.arrivalTime.toISOString) {
        payload.arrivalTime = payload.arrivalTime.toISOString();
      }

      // Ensure price is a number
      if (payload.price) {
        payload.price = Number(payload.price);
      }

      // Use seats from the copied schedule or form values
      payload.seats = values.seats || copyScheduleData.seats || [];

      // Ensure seats array is properly formatted
      if (payload.seats && Array.isArray(payload.seats)) {
        payload.seats = payload.seats.map((seat: any) => ({
          row: Number(seat.row),
          column: Number(seat.column),
          seatNumber: Number(seat.seatNumber),
          seatName: seat.seatName || undefined,
          isBroken: Boolean(seat.isBroken),
          isAisle: Boolean(seat.isAisle),
          fare: seat.fare ? Number(seat.fare) : payload.price || 0,
        }));
      }

      // Remove defaultFare from payload as it's not part of the model
      delete payload.defaultFare;

      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create schedule");
      }

      toast.success("Schedule copied successfully");
      setCopyModalVisible(false);
      setCopyScheduleData(null);
      fetchSchedules();
    } catch (error: any) {
      toast.error(error.message || "Failed to copy schedule");
    } finally {
      setCopyLoading(false);
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
          <button
            className="flex cursor-pointer items-center justify-center rounded-full bg-green-200 p-2 text-white transition-colors hover:bg-green-300 dark:bg-green-500/40 dark:hover:bg-green-500/60"
            title="Copy"
            onClick={() => handleCopy(record)}
            disabled={copyLoading}
          >
            <FiCopy className="h-4 w-4 text-green-600 dark:text-green-400" />
          </button>
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

      {/* Copy Schedule Modal */}
      <CopyScheduleModal
        visible={copyModalVisible}
        scheduleData={copyScheduleData}
        loading={copyLoading}
        onCancel={() => {
          setCopyModalVisible(false);
          setCopyScheduleData(null);
        }}
        onSubmit={handleCopySubmit}
      />
    </div>
  );
}

// Copy Schedule Modal Component
function CopyScheduleModal({
  visible,
  scheduleData,
  loading,
  onCancel,
  onSubmit,
}: {
  visible: boolean;
  scheduleData: Schedule | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}) {
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [buses, setBuses] = useState<{ label: string; value: string }[]>([]);
  const [routes, setRoutes] = useState<{ label: string; value: string }[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (visible) {
      // Fetch dropdown data
      const fetchData = async () => {
        try {
          const [companiesRes, busesRes, routesRes] = await Promise.all([
            fetch("/api/companies"),
            fetch("/api/buses"),
            fetch("/api/routes"),
          ]);

          if (companiesRes.ok) {
            const data = await companiesRes.json();
            setCompanies(
              Array.isArray(data)
                ? data.map((c: any) => ({ label: c.name, value: c._id }))
                : []
            );
          }

          if (busesRes.ok) {
            const data = await busesRes.json();
            const busOptions = Array.isArray(data)
              ? data.map((b: any) => ({
                  label: `${b.number} (${b.type})`,
                  value: b._id,
                  company:
                    typeof b.company === "object" && b.company !== null
                      ? b.company._id
                      : b.company,
                }))
              : [];
            setBuses(busOptions);
            
            // Filter buses based on schedule's company if available
            if (scheduleData?.company) {
              const companyId =
                typeof scheduleData.company === "object"
                  ? scheduleData.company._id
                  : scheduleData.company;
              const filtered = busOptions.filter((b: any) => b.company === companyId);
              setFilteredBuses(filtered.length > 0 ? filtered : busOptions);
            } else {
              setFilteredBuses(busOptions);
            }
          }

          if (routesRes.ok) {
            const data = await routesRes.json();
            setRoutes(
              Array.isArray(data)
                ? data.map((r: any) => ({
                    label: `${r.name} (${
                      typeof r.from === "object" ? r.from.name : r.from
                    } - ${typeof r.to === "object" ? r.to.name : r.to})`,
                    value: r._id,
                  }))
                : []
            );
          }
        } catch {
          toast.error("Failed to load data");
        }
      };

      fetchData();
    }
  }, [visible, scheduleData]);

  // Populate form when scheduleData and buses are available
  useEffect(() => {
    if (visible && scheduleData && buses.length > 0) {
      const companyId =
        scheduleData.company && typeof scheduleData.company === "object"
          ? scheduleData.company._id
          : scheduleData.company;

      // Filter buses based on company
      if (companyId) {
        const filtered = buses.filter((b: any) => b.company === companyId);
        setFilteredBuses(filtered.length > 0 ? filtered : buses);
      }

      form.setFieldsValue({
        number: scheduleData.number || "",
        company: companyId,
        bus:
          scheduleData.bus && typeof scheduleData.bus === "object"
            ? scheduleData.bus._id
            : scheduleData.bus,
        route:
          scheduleData.route && typeof scheduleData.route === "object"
            ? scheduleData.route._id
            : scheduleData.route,
        departureTime: scheduleData.departureTime
          ? dayjs(scheduleData.departureTime)
          : null,
        arrivalTime: scheduleData.arrivalTime
          ? dayjs(scheduleData.arrivalTime)
          : null,
        price: scheduleData.price,
        status: scheduleData.status || "Scheduled",
        seats: scheduleData.seats || [],
      });
    }
  }, [visible, scheduleData, buses, form]);

  const handleCompanyChange = (companyId: string) => {
    if (companyId) {
      const filtered = buses.filter((b: any) => b.company === companyId);
      setFilteredBuses(filtered.length > 0 ? filtered : buses);
      form.setFieldsValue({ bus: undefined });
    } else {
      setFilteredBuses(buses);
    }
  };

  return (
    <Modal
      title="Copy Schedule"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
      style={{ top: 20 }}
      afterClose={() => {
        form.resetFields();
      }}
    >
      {loading || !scheduleData ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Loading schedule details...</p>
          </div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          className="mt-4"
        >
          <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Basic Information
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item
              name="number"
              label={
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Schedule Number
                </span>
              }
              rules={[
                { required: true, message: "Schedule number is required" },
              ]}
              className="md:col-span-2"
            >
              <Input
                size="large"
                placeholder="e.g. SCH-2024-001"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="company"
              label={
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Company
                </span>
              }
              rules={[{ required: true, message: "Company is required" }]}
              className="md:col-span-2"
            >
              <Select
                size="large"
                placeholder="Select company"
                className="rounded-lg"
                showSearch
                optionFilterProp="label"
                options={companies}
                onChange={handleCompanyChange}
              />
            </Form.Item>

            <Form.Item
              name="bus"
              label={
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Bus
                </span>
              }
              rules={[{ required: true, message: "Bus is required" }]}
            >
              <Select
                size="large"
                placeholder="Select bus"
                className="rounded-lg"
                showSearch
                optionFilterProp="label"
                options={filteredBuses}
                disabled={filteredBuses.length === 0}
              />
            </Form.Item>

            <Form.Item
              name="route"
              label={
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Route
                </span>
              }
              rules={[{ required: true, message: "Route is required" }]}
            >
              <Select
                size="large"
                placeholder="Select route"
                className="rounded-lg"
                showSearch
                optionFilterProp="label"
                options={routes}
              />
            </Form.Item>
          </div>
        </div>

        <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Schedule Details
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item
              name="departureTime"
              label={
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Departure Time
                </span>
              }
              rules={[
                { required: true, message: "Departure time is required" },
              ]}
            >
              <DatePicker
                showTime
                size="large"
                className="w-full rounded-lg"
                format="YYYY-MM-DD HH:mm"
                placeholder="Select departure date and time"
              />
            </Form.Item>

            <Form.Item
              name="arrivalTime"
              label={
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Arrival Time
                </span>
              }
              rules={[
                { required: true, message: "Arrival time is required" },
              ]}
            >
              <DatePicker
                showTime
                size="large"
                className="w-full rounded-lg"
                format="YYYY-MM-DD HH:mm"
                placeholder="Select arrival date and time"
              />
            </Form.Item>
          </div>
        </div>

        <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Pricing & Status
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item
              name="price"
              label={
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Ticket Price (৳)
                </span>
              }
              rules={[
                { required: true, message: "Price is required" },
                {
                  type: "number",
                  min: 0,
                  message: "Price must be a positive number",
                },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="e.g. 500"
                className="rounded-lg"
                style={{ width: "100%" }}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label={
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Status
                </span>
              }
              initialValue="Scheduled"
            >
              <Select
                size="large"
                className="rounded-lg"
                options={[
                  { label: "Scheduled", value: "Scheduled" },
                  { label: "Delayed", value: "Delayed" },
                  { label: "Completed", value: "Completed" },
                  { label: "Cancelled", value: "Cancelled" },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button size="large" onClick={onCancel} className="rounded-lg">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700"
          >
            Create Schedule
          </Button>
        </div>
      </Form>
      )}
    </Modal>
  );
}
