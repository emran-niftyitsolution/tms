"use client";

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiInfo, FiMapPin, FiSave, FiSettings, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/companies/${id}`);
        if (!res.ok) throw new Error("Company not found");
        const data = await res.json();
        form.setFieldsValue(data);
      } catch (error) {
        toast.error("Failed to load company details");
        router.push("/dashboard/companies");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchCompany();
  }, [id, form, router]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update company");

      toast.success("Company updated successfully");
      router.push("/dashboard/companies");
    } catch (error) {
      toast.error("Failed to update company");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete company");
      toast.success("Company deleted");
      router.push("/dashboard/companies");
    } catch (error) {
      toast.error("Failed to delete company");
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Edit Company
          </h1>
          <p className="mt-1 text-slate-500">
            Update company details, location, and settings.
          </p>
        </div>
        <Space size="middle">
          <Button
            danger
            icon={<FiTrash2 />}
            onClick={handleDelete}
            size="large"
          >
            Delete
          </Button>
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
            Save Changes
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card
              bordered={false}
              className="mb-8 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
              title={
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <FiInfo className="text-indigo-500" /> Basic Information
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Form.Item
                    name="name"
                    label={
                      <span className="font-medium text-slate-600">
                        Company Name
                      </span>
                    }
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input
                      placeholder="e.g. Green Line Paribahan"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="type"
                    label={
                      <span className="font-medium text-slate-600">
                        Transport Type
                      </span>
                    }
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Select
                      placeholder="Select Type"
                      size="large"
                      className="rounded-lg"
                    >
                      <Select.Option value="Bus">Bus</Select.Option>
                      <Select.Option value="Train">Train</Select.Option>
                      <Select.Option value="Air">Air</Select.Option>
                      <Select.Option value="Ship">Ship</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="routes"
                    label={
                      <span className="font-medium text-slate-600">
                        No. of Routes
                      </span>
                    }
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>

            <Card
              bordered={false}
              className="shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
              title={
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <FiMapPin className="text-indigo-500" /> Location & Contact
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
                <div>
                  <Form.Item
                    name="email"
                    label={
                      <span className="font-medium text-slate-600">
                        Email Address
                      </span>
                    }
                  >
                    <Input
                      placeholder="contact@company.com"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="phone"
                    label={
                      <span className="font-medium text-slate-600">
                        Phone Number
                      </span>
                    }
                  >
                    <Input
                      placeholder="+880 1..."
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>

                <div className="md:col-span-2">
                  <Divider dashed style={{ margin: "8px 0 24px 0" }} />
                </div>

                <div className="md:col-span-2">
                  <Form.Item
                    name="street"
                    label={
                      <span className="font-medium text-slate-600">
                        Street Address
                      </span>
                    }
                  >
                    <Input
                      placeholder="123 Main St, Suite 400"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item
                    name="city"
                    label={
                      <span className="font-medium text-slate-600">City</span>
                    }
                  >
                    <Input
                      placeholder="Dhaka"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="state"
                    label={
                      <span className="font-medium text-slate-600">
                        State / Division
                      </span>
                    }
                  >
                    <Input
                      placeholder="Dhaka"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="zip"
                    label={
                      <span className="font-medium text-slate-600">
                        Zip / Postal Code
                      </span>
                    }
                  >
                    <Input
                      placeholder="1212"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    name="country"
                    label={
                      <span className="font-medium text-slate-600">
                        Country
                      </span>
                    }
                  >
                    <Input
                      placeholder="Bangladesh"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card
              bordered={false}
              className="mb-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
              title={
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <FiSettings className="text-indigo-500" /> Settings
                </div>
              }
            >
              <Form.Item
                name="status"
                label={
                  <span className="font-medium text-slate-600">
                    Account Status
                  </span>
                }
              >
                <Select size="large" className="rounded-lg">
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="license"
                label={
                  <span className="font-medium text-slate-600">
                    License Number
                  </span>
                }
                tooltip="Government issued transport license"
              >
                <Input
                  placeholder="LIC-12345"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
}
