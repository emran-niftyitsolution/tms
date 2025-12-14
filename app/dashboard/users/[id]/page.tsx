"use client";

import { Button, Form, Input, Select, Space, Spin } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiInfo, FiSave, FiShield, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { FormLoader } from "../../components/Loader";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>(
    []
  );
  const [form] = Form.useForm();

  // Watch role to conditionally show/require company
  const role = Form.useWatch("role", form);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, companiesRes] = await Promise.all([
          fetch(`/api/users/${id}`),
          fetch("/api/companies"),
        ]);

        if (!userRes.ok) throw new Error("User not found");
        
        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setCompanies(
            companiesData.map((c: any) => ({ label: c.name, value: c._id }))
          );
        }

        const userData = await userRes.json();
        const { password, ...formData } = userData;
        form.setFieldsValue(formData);
      } catch (error) {
        toast.error("Failed to load details");
        router.push("/dashboard/users");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchData();
  }, [id, form, router]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      // Don't send empty password
      if (!values.password) {
        delete values.password;
      }

      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update user");

      toast.success("User updated successfully");
      router.push("/dashboard/users");
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      toast.success("User deleted");
      router.push("/dashboard/users");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Edit User
          </h1>
          <p className="mt-1 text-slate-500">
            Update user details and permissions.
          </p>
        </div>
        <Space size="middle">
          <Button
            danger
            icon={<FiTrash2 />}
            onClick={handleDelete}
            size="large"
            disabled={fetching}
          >
            Delete
          </Button>
          <Button onClick={() => router.back()} size="large" disabled={fetching}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            icon={<FiSave />}
            size="large"
            disabled={fetching}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
            }}
          >
            Save Changes
          </Button>
        </Space>
      </div>

      <FormLoader loading={fetching}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
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
                    <span className="font-medium text-slate-600">
                      New Password (Optional)
                    </span>
                  }
                >
                  <Input.Password
                    placeholder="Leave blank to keep current"
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

              {/* Show Company selection only for Operator or User roles */}
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
      </FormLoader>
    </div>
  );
}
