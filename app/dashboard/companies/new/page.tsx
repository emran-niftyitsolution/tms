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
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiInfo, FiMapPin, FiSave, FiSettings } from "react-icons/fi";
import { toast } from "sonner";

export default function NewCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to create company");

      toast.success("Company created successfully");
      router.push("/dashboard/companies");
    } catch (error) {
      toast.error("Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Add New Company
          </h1>
          <p className="mt-1 text-slate-500">
            Register a new transport operator partner.
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
            Create Company
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: "Active", routes: 0, country: "Bangladesh" }}
        requiredMark="optional"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card
              bordered={false}
              className="shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
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
                        Initial Routes
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
                  <span className="font-medium text-slate-600">Status</span>
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

            <div className="rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
              <h4 className="mb-1 font-semibold">Pro Tip</h4>
              <p>
                Complete address details help in automatic route generation and
                mapping.
              </p>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
