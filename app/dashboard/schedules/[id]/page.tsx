"use client";

import { Breadcrumb, Button, Card, Descriptions, Form, InputNumber, Select, Tabs, Tag } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import { FiCalendar, FiInfo, FiUsers, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function ScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [staff, setStaff] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    fetchScheduleData();
  }, [resolvedParams.id]);

  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      const [scheduleRes, staffRes] = await Promise.all([
        fetch(`/api/schedules/${resolvedParams.id}`),
        fetch("/api/staff"),
      ]);

      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        setSchedule(scheduleData);
        form.setFieldsValue({
          price: scheduleData.price,
          status: scheduleData.status,
        });

        // Fetch assignments after we have the bus ID
        if (scheduleData.bus?._id) {
          const assignmentsRes = await fetch(`/api/bus-assignments?busId=${scheduleData.bus._id}`);
          if (assignmentsRes.ok) {
            const data = await assignmentsRes.json();
            setAssignments(Array.isArray(data) ? data : []);
          }
        }
      }

      if (staffRes.ok) {
        const data = await staffRes.json();
        setStaff(Array.isArray(data) ? data.filter((s: any) => s.role === "Driver" || s.role === "Helper") : []);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onScheduleUpdate = async (values: any) => {
    try {
      const res = await fetch(`/api/schedules/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update");
      toast.success("Schedule updated successfully");
      fetchScheduleData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-12">Loading...</div>;
  if (!schedule) return <div className="text-center py-12">Schedule not found</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/schedules">Schedules</Link> },
          { title: `Trip ${dayjs(schedule.departureTime).format("MMM D, YYYY")}` },
        ]}
        className="mb-4"
      />

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Trip Schedule
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {dayjs(schedule.departureTime).format("MMMM D, YYYY [at] h:mm A")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Tag color={schedule.status === "Scheduled" ? "blue" : schedule.status === "Completed" ? "success" : "default"}>
                {schedule.status}
              </Tag>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Ticket Price</div>
            <div className="text-2xl font-bold">৳{schedule.price?.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "overview",
            label: (
              <span className="flex items-center gap-2">
                <FiInfo /> Overview
              </span>
            ),
            children: (
              <div className="space-y-6">
                <Card title="Trip Information">
                  <Descriptions column={2} bordered>
                    <Descriptions.Item label="Bus">
                      {schedule.bus ? (
                        <Link href={`/dashboard/buses/${schedule.bus._id}`} className="text-indigo-600 hover:text-indigo-700">
                          {schedule.bus.number} ({schedule.bus.type})
                        </Link>
                      ) : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Route">
                      {schedule.route ? (
                        <Link href={`/dashboard/routes/${schedule.route._id}`} className="text-indigo-600 hover:text-indigo-700">
                          {schedule.route.name}
                        </Link>
                      ) : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="From">
                      {schedule.route?.from || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="To">
                      {schedule.route?.to || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Departure">
                      {dayjs(schedule.departureTime).format("MMM D, YYYY h:mm A")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Arrival">
                      {dayjs(schedule.arrivalTime).format("MMM D, YYYY h:mm A")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Duration">
                      {dayjs(schedule.arrivalTime).diff(dayjs(schedule.departureTime), "hour")} hours
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                      ৳{schedule.price?.toLocaleString()}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title="Quick Actions">
                  <div className="flex gap-4">
                    <Link href={`/dashboard/buses/${schedule.bus?._id}`}>
                      <Button>View Bus Details</Button>
                    </Link>
                    <Link href={`/dashboard/routes/${schedule.route?._id}`}>
                      <Button>View Route Details</Button>
                    </Link>
                  </div>
                </Card>
              </div>
            ),
          },
          {
            key: "settings",
            label: (
              <span className="flex items-center gap-2">
                <FiCalendar /> Settings
              </span>
            ),
            children: (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
                <Form form={form} layout="vertical" onFinish={onScheduleUpdate}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Form.Item name="price" label="Ticket Price (৳)" rules={[{ required: true }]}>
                      <InputNumber min={0} style={{ width: "100%" }} size="large" />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                      <Select size="large" options={[
                        { label: "Scheduled", value: "Scheduled" },
                        { label: "Delayed", value: "Delayed" },
                        { label: "Completed", value: "Completed" },
                        { label: "Cancelled", value: "Cancelled" },
                      ]} />
                    </Form.Item>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <Button size="large" onClick={() => router.back()}>Cancel</Button>
                    <Button type="primary" htmlType="submit" size="large" icon={<FiSave />}>Update Schedule</Button>
                  </div>
                </Form>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
