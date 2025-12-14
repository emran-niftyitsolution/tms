"use client";

import { Button, Form, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";

export default function NewCityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const data = await res.json();
          setCompanies(
            Array.isArray(data)
              ? data.map((c: any) => ({ label: c.name, value: c._id }))
              : []
          );
        }
      } catch {
        toast.error("Failed to load companies");
      }
    };
    fetchCompanies();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create city");
      }

      toast.success("City created successfully");
      router.push("/dashboard/cities");
    } catch (error: any) {
      console.error("Error creating city:", error);
      toast.error(error.message || "Failed to create city");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Add New City
        </h2>
        <p className="text-sm text-slate-500">
          Add a new city to the system
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item
              name="name"
              label={<span className="font-medium text-slate-600">City Name</span>}
              rules={[{ required: true, message: "City name is required" }]}
              className="md:col-span-2"
            >
              <Input
                size="large"
                placeholder="e.g. Dhaka"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="code"
              label={<span className="font-medium text-slate-600">City Code</span>}
            >
              <Input
                size="large"
                placeholder="e.g. DAC"
                className="rounded-lg"
                style={{ textTransform: "uppercase" }}
              />
            </Form.Item>

            <Form.Item
              name="company"
              label={<span className="font-medium text-slate-600">Company</span>}
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
              name="status"
              label={<span className="font-medium text-slate-600">Status</span>}
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
              Create City
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

