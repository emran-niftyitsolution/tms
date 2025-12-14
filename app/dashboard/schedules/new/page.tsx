"use client";

import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";

function NewScheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);
  const [buses, setBuses] = useState<{ label: string; value: string }[]>([]);
  const [routes, setRoutes] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
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
          setBuses(
            Array.isArray(data)
              ? data.map((b: any) => ({ label: `${b.number} (${b.type})`, value: b._id }))
              : []
          );
        }

        if (routesRes.ok) {
          const data = await routesRes.json();
          setRoutes(
            Array.isArray(data)
              ? data.map((r: any) => ({ label: `${r.name} (${r.from}-${r.to})`, value: r._id }))
              : []
          );
        }

        // Pre-fill form if busId or routeId in query params
        const busId = searchParams.get("busId");
        const routeId = searchParams.get("routeId");
        if (busId) form.setFieldsValue({ bus: busId });
        if (routeId) form.setFieldsValue({ route: routeId });
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [searchParams, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create schedule");
      }

      toast.success("Schedule created successfully");
      router.push("/dashboard/schedules");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Add New Schedule
        </h2>
        <p className="text-sm text-slate-500">
          Schedule a new trip
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item
              name="company"
              label={<span className="font-medium text-slate-600">Company</span>}
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
              />
            </Form.Item>

            <Form.Item
              name="bus"
              label={<span className="font-medium text-slate-600">Bus</span>}
              rules={[{ required: true, message: "Bus is required" }]}
            >
              <Select
                size="large"
                placeholder="Select bus"
                className="rounded-lg"
                showSearch
                optionFilterProp="label"
                options={buses}
              />
            </Form.Item>

            <Form.Item
              name="route"
              label={<span className="font-medium text-slate-600">Route</span>}
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

            <Form.Item
              name="departureTime"
              label={<span className="font-medium text-slate-600">Departure Time</span>}
              rules={[{ required: true, message: "Departure time is required" }]}
            >
              <DatePicker
                showTime
                size="large"
                className="w-full rounded-lg"
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>

            <Form.Item
              name="arrivalTime"
              label={<span className="font-medium text-slate-600">Arrival Time</span>}
              rules={[{ required: true, message: "Arrival time is required" }]}
            >
              <DatePicker
                showTime
                size="large"
                className="w-full rounded-lg"
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>

            <Form.Item
              name="price"
              label={<span className="font-medium text-slate-600">Ticket Price (৳)</span>}
              rules={[{ required: true, message: "Price is required" }]}
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
              label={<span className="font-medium text-slate-600">Status</span>}
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

          <div className="mt-6 flex justify-end gap-4">
            <Button
              size="large"
              onClick={() => router.back()}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<FiSave />}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700"
            >
              Create Schedule
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default function NewSchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewScheduleForm />
    </Suspense>
  );
}

