"use client";

import { Button, Checkbox, Form, Input, Select, Table, TimePicker } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

export default function NewRoutePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [stoppages, setStoppages] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, stoppagesRes] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/stoppages"),
        ]);

        if (companiesRes.ok) {
          const data = await companiesRes.json();
          setCompanies(
            Array.isArray(data)
              ? data.map((c: any) => ({ label: c.name, value: c._id }))
              : []
          );
        }

        if (stoppagesRes.ok) {
          const data = await stoppagesRes.json();
          setStoppages(
            Array.isArray(data)
              ? data.map((s: any) => ({
                  label: `${s.name}${s.city?.name ? ` (${s.city.name})` : ""}`,
                  value: s._id,
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
      // Convert time picker values to strings
      if (values.stoppages) {
        values.stoppages = values.stoppages.map((stoppage: any) => ({
          ...stoppage,
          boardingTime: stoppage.boardingTime
            ? dayjs(stoppage.boardingTime).format("HH:mm")
            : undefined,
          droppingTime: stoppage.droppingTime
            ? dayjs(stoppage.droppingTime).format("HH:mm")
            : undefined,
          enable: Boolean(stoppage.enable),
          boarding: Boolean(stoppage.boarding),
          dropping: Boolean(stoppage.dropping),
        }));
      }

      const res = await fetch("/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create route");
      }

      toast.success("Route created successfully");
      router.push("/dashboard/routes");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Add New Route
        </h2>
        <p className="text-sm text-slate-500">
          Enter the details of the new route
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item
              name="company"
              label={
                <span className="font-medium text-slate-600">Company</span>
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
              />
            </Form.Item>

            <Form.Item
              name="name"
              label={
                <span className="font-medium text-slate-600">Route Name</span>
              }
              rules={[{ required: true, message: "Route name is required" }]}
              className="md:col-span-2"
            >
              <Input
                size="large"
                placeholder="e.g. Dhaka - Chittagong"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="from"
              label={<span className="font-medium text-slate-600">From</span>}
              rules={[
                { required: true, message: "Start location is required" },
              ]}
            >
              <Select
                size="large"
                placeholder="Select stoppage"
                className="rounded-lg"
                showSearch
                optionFilterProp="label"
                options={stoppages}
              />
            </Form.Item>

            <Form.Item
              name="to"
              label={<span className="font-medium text-slate-600">To</span>}
              rules={[{ required: true, message: "End location is required" }]}
            >
              <Select
                size="large"
                placeholder="Select stoppage"
                className="rounded-lg"
                showSearch
                optionFilterProp="label"
                options={stoppages}
              />
            </Form.Item>

            <div className="md:col-span-2">
              <Form.List name="stoppages">
                {(fields, { add, remove }) => (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-slate-600">
                        Stoppages (Intermediate Stops)
                      </label>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<FiPlus />}
                        className="flex items-center gap-2"
                      >
                        Add Stoppage
                      </Button>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <Table
                        dataSource={fields}
                        rowKey="key"
                        pagination={false}
                        size="small"
                        columns={[
                          {
                            title: "#",
                            key: "index",
                            width: 50,
                            render: (_: any, __: any, index: number) =>
                              index + 1,
                          },
                          {
                            title: "Enable",
                            key: "enable",
                            width: 80,
                            render: (_: any, field: any) => (
                              <Form.Item
                                {...field}
                                name={[field.name, "enable"]}
                                valuePropName="checked"
                                initialValue={true}
                                className="mb-0"
                              >
                                <Checkbox />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Stoppage",
                            key: "place",
                            width: 200,
                            render: (_: any, field: any) => (
                              <Form.Item
                                {...field}
                                name={[field.name, "place"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Stoppage is required",
                                  },
                                ]}
                                className="mb-0"
                              >
                                <Select
                                  size="small"
                                  placeholder="Select stoppage"
                                  className="rounded-lg"
                                  showSearch
                                  optionFilterProp="label"
                                  options={stoppages}
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Boarding",
                            key: "boarding",
                            width: 100,
                            render: (_: any, field: any) => (
                              <Form.Item
                                {...field}
                                name={[field.name, "boarding"]}
                                valuePropName="checked"
                                initialValue={false}
                                className="mb-0"
                              >
                                <Checkbox />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Boarding Time",
                            key: "boardingTime",
                            width: 150,
                            render: (_: any, field: any) => (
                              <Form.Item
                                {...field}
                                name={[field.name, "boardingTime"]}
                                className="mb-0"
                              >
                                <TimePicker
                                  size="small"
                                  className="w-full rounded-lg"
                                  format="HH:mm"
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Dropping",
                            key: "dropping",
                            width: 100,
                            render: (_: any, field: any) => (
                              <Form.Item
                                {...field}
                                name={[field.name, "dropping"]}
                                valuePropName="checked"
                                initialValue={false}
                                className="mb-0"
                              >
                                <Checkbox />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Dropping Time",
                            key: "droppingTime",
                            width: 150,
                            render: (_: any, field: any) => (
                              <Form.Item
                                {...field}
                                name={[field.name, "droppingTime"]}
                                className="mb-0"
                              >
                                <TimePicker
                                  size="small"
                                  className="w-full rounded-lg"
                                  format="HH:mm"
                                />
                              </Form.Item>
                            ),
                          },
                          {
                            title: "Action",
                            key: "action",
                            width: 80,
                            onCell: () => ({
                              style: { verticalAlign: "top" },
                            }),
                            render: (_: any, field: any) => (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  paddingTop: 4,
                                }}
                              >
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<FiTrash2 />}
                                  onClick={() => remove(field.name)}
                                />
                              </div>
                            ),
                          },
                        ]}
                      />
                    </div>
                  </div>
                )}
              </Form.List>
            </div>

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
              Create Route
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
