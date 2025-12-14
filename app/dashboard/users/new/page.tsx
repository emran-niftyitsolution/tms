"use client";

import { Button, Form, Input, Select, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiInfo, FiSave, FiShield } from "react-icons/fi";
import { toast } from "sonner";

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>(
    []
  );
  const [form] = Form.useForm();

  // Watch the role field to conditionally show company input
  const role = Form.useWatch("role", form);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const data = await res.json();
          setCompanies(
            data.map((c: any) => ({ label: c.name, value: c._id }))
          );
        }
      } catch (error) {
        console.error("Failed to load companies");
      }
    };
    fetchCompanies();
  }, []);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to create user");

      toast.success("User created successfully");
      router.push("/dashboard/users");
    } catch (error) {
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Add New User
          </h1>
          <p className="mt-1 text-slate-500">
            Create a new user account with specific roles.
          </p>
        </div>
        <Space size="middle">
          <Button onClick={() => router.back()} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            icon={<FiSave />}
            size="large"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
            }}
          >
            Create User
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ role: "User", permissions: [] }}
        requiredMark="optional"
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-lg font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
              <FiInfo className="text-indigo-500" /> Account Information
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
              <div className="md:col-span-2">
                <Form.Item
                  name="name"
                  label={
                    <span className="font-medium text-slate-600">Full Name</span>
                  }
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    placeholder="e.g. John Doe"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
              <div className="md:col-span-2">
                <Form.Item
                  name="email"
                  label={
                    <span className="font-medium text-slate-600">
                      Email Address
                    </span>
                  }
                  rules={[
                    { required: true, message: "Required" },
                    { type: "email", message: "Invalid email" },
                  ]}
                >
                  <Input
                    placeholder="john@example.com"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
              <div className="md:col-span-2">
                <Form.Item
                  name="password"
                  label={
                    <span className="font-medium text-slate-600">Password</span>
                  }
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input.Password
                    placeholder="••••••••"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-lg font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
              <FiShield className="text-indigo-500" /> Role & Permissions
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
              <div className="md:col-span-2">
                <Form.Item
                  name="role"
                  label={<span className="font-medium text-slate-600">Role</span>}
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select size="large" className="rounded-lg">
                    <Select.Option value="Admin">Admin</Select.Option>
                    <Select.Option value="Operator">Operator</Select.Option>
                    <Select.Option value="User">User</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Show Company selection only for Operator or User roles if needed */}
              {(role === "Operator" || role === "User") && (
                <div className="md:col-span-2">
                  <Form.Item
                    name="company"
                    label={
                      <span className="font-medium text-slate-600">
                        Assigned Company
                      </span>
                    }
                    rules={[{ required: role === "Operator", message: "Required for Operators" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Select a company"
                      className="rounded-lg"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={companies}
                    />
                  </Form.Item>
                </div>
              )}

              <div className="md:col-span-2">
                <Form.Item
                  name="permissions"
                  label={
                    <span className="font-medium text-slate-600">
                      Permissions
                    </span>
                  }
                >
                  <Select
                    mode="tags"
                    size="large"
                    placeholder="Select permissions"
                    className="rounded-lg"
                    options={[
                      { value: "manage_users", label: "Manage Users" },
                      { value: "manage_companies", label: "Manage Companies" },
                      { value: "view_reports", label: "View Reports" },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
