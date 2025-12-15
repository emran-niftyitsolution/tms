"use client";

import { Button, Checkbox, Form, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";

export default function NewStoppagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, citiesRes] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/cities"),
        ]);

        if (companiesRes.ok) {
          const data = await companiesRes.json();
          setCompanies(
            Array.isArray(data)
              ? data.map((c: any) => ({
                  label: c.name,
                  value: c._id,
                }))
              : []
          );
        }

        if (citiesRes.ok) {
          const data = await citiesRes.json();
          setCities(
            Array.isArray(data)
              ? data.map((c: any) => ({
                  label: c.name,
                  value: c._id,
                }))
              : []
          );
        }
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Ensure boolean fields are explicitly set and converted to boolean
      const payload = {
        ...values,
        boarding: Boolean(values.boarding ?? true),
        dropping: Boolean(values.dropping ?? true),
        counter: Boolean(values.counter ?? false),
      };

      const res = await fetch("/api/stoppages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create stoppage");
      }

      toast.success("Stoppage created successfully");
      router.push("/dashboard/stoppages");
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
          Add New Stoppage
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Add a new boarding/dropping point
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item
              name="company"
              label={
                <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                  Company
                </span>
              }
              rules={[{ required: true, message: "Company is required" }]}
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
              name="city"
              label={
                <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                  City
                </span>
              }
              rules={[{ required: true, message: "City is required" }]}
            >
              <Select
                size="large"
                placeholder="Select city"
                className="rounded-lg"
                showSearch
                optionFilterProp="label"
                options={cities}
              />
            </Form.Item>

            <Form.Item
              name="name"
              label={
                <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                  Stoppage Name
                </span>
              }
              rules={[{ required: true, message: "Stoppage name is required" }]}
              className="md:col-span-2"
            >
              <Input
                size="large"
                placeholder="e.g. Gulshan Bus Stop"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="code"
              label={
                <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                  Stoppage Code
                </span>
              }
            >
              <Input
                size="large"
                placeholder="e.g. GBS"
                className="rounded-lg"
                style={{ textTransform: "uppercase" }}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label={
                <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                  Status
                </span>
              }
              initialValue="Active"
            >
              <Select
                size="large"
                className="rounded-lg"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </Form.Item>

            <div className="md:col-span-2 border-t pt-4 border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <Form.Item
                  name="boarding"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Checkbox className="text-slate-700 dark:text-white dark:text-slate-300">
                    Boarding
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name="dropping"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Checkbox className="text-slate-700 dark:text-white dark:text-slate-300">
                    Dropping
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name="counter"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox className="text-slate-700 dark:text-white dark:text-slate-300">
                    Counter
                  </Checkbox>
                </Form.Item>
              </div>
            </div>
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
              Create Stoppage
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
