"use client";

import { Button, Form, Input, Select, Space } from "antd";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { FormLoader } from "../../components/Loader";

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeRes, companiesRes] = await Promise.all([
          fetch(`/api/staff/${resolvedParams.id}`),
          fetch("/api/companies"),
        ]);

        if (employeeRes.ok) {
          const employeeData = await employeeRes.json();
          if (employeeData.company && typeof employeeData.company === "object") {
            employeeData.company = employeeData.company._id;
          }
          form.setFieldsValue(employeeData);
        }

        if (companiesRes.ok) {
          const data = await companiesRes.json();
          setCompanies(
            Array.isArray(data)
              ? data.map((c: any) => ({ label: c.name, value: c._id }))
              : []
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch staff data");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, form]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update staff");
      }

      toast.success("Staff updated successfully");
      router.push("/dashboard/employees");
    } catch (error: any) {
      toast.error(error.message || "Failed to update staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Edit Staff
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update staff information
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <FormLoader loading={fetching}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item
              name="company"
              label={<span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Company</span>}
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
              name="name"
              label={<span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Name</span>}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input size="large" placeholder="Staff name" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="role"
              label={<span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Role</span>}
              rules={[{ required: true, message: "Role is required" }]}
            >
              <Select
                size="large"
                placeholder="Select role"
                className="rounded-lg"
                options={[
                  { label: "Driver", value: "Driver" },
                  { label: "Helper", value: "Helper" },
                  { label: "Supervisor", value: "Supervisor" },
                  { label: "Guide", value: "Guide" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="contactNumber"
              label={<span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Contact Number</span>}
              rules={[{ required: true, message: "Contact number is required" }]}
            >
              <Input size="large" placeholder="Phone number" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="licenseNumber"
              label={<span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">License Number</span>}
            >
              <Input size="large" placeholder="License number (optional)" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="nid"
              label={<span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">NID</span>}
            >
              <Input size="large" placeholder="National ID (optional)" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="status"
              label={<span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Status</span>}
            >
              <Select
                size="large"
                className="rounded-lg"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "On Leave", value: "OnLeave" },
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
              Update Staff
            </Button>
          </div>
        </Form>
        </FormLoader>
      </div>
    </div>
  );
}

