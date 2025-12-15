"use client";

import { Button, Checkbox, Form, Input, Select, Table, TimePicker } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FiInfo, FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { FormLoader } from "../../components/Loader";

export default function RouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [route, setRoute] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [stoppages, setStoppages] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    fetchRouteData();
  }, [resolvedParams.id]);

  const fetchRouteData = async () => {
    setPageLoading(true);
    try {
      const [routeRes, companiesRes, stoppagesRes] =
        await Promise.all([
          fetch(`/api/routes/${resolvedParams.id}`),
          fetch("/api/companies"),
          fetch("/api/stoppages"),
        ]);

      if (routeRes.ok) {
        const routeData = await routeRes.json();
        setRoute(routeData);

        // Convert populated objects to IDs for form
        if (routeData.company && typeof routeData.company === "object") {
          routeData.company = routeData.company._id;
        }
        if (routeData.from && typeof routeData.from === "object") {
          routeData.from = routeData.from._id;
        }
        if (routeData.to && typeof routeData.to === "object") {
          routeData.to = routeData.to._id;
        }

        // Convert stoppages times to dayjs objects
        if (routeData.stoppages && Array.isArray(routeData.stoppages)) {
          routeData.stoppages = routeData.stoppages.map((stoppage: any) => ({
            ...stoppage,
            place: stoppage.place?._id || stoppage.place,
            boardingTime: stoppage.boardingTime
              ? dayjs(stoppage.boardingTime, "HH:mm")
              : undefined,
            droppingTime: stoppage.droppingTime
              ? dayjs(stoppage.droppingTime, "HH:mm")
              : undefined,
          }));
        }

        form.setFieldsValue(routeData);
      }

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
    } finally {
      setPageLoading(false);
    }
  };

  const onRouteUpdate = async (values: any) => {
    setSaving(true);
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

      const res = await fetch(`/api/routes/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to update");
      toast.success("Route updated successfully");
      fetchRouteData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!route && !pageLoading)
    return <div className="text-center py-12">Route not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Edit Route
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update the details of this route
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <div className="mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
          <FiInfo />
          <h2 className="text-lg font-semibold">Route Information</h2>
        </div>
        <FormLoader loading={pageLoading}>
          <Form form={form} layout="vertical" onFinish={onRouteUpdate}>
            <div className="grid gap-6 md:grid-cols-2">
              <Form.Item
                name="company"
                label={
                  <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                    Company
                  </span>
                }
                rules={[
                  { required: true, message: "Company is required" },
                ]}
                className="md:col-span-2"
              >
                <Select
                  size="large"
                  placeholder="Select company"
                  options={companies}
                  className="rounded-lg"
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>

              <Form.Item
                name="name"
                label={
                  <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                    Route Name
                  </span>
                }
                rules={[
                  { required: true, message: "Route name is required" },
                ]}
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
                label={
                  <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                    From
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Start location is required",
                  },
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
                label={
                  <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                    To
                  </span>
                }
                rules={[
                  { required: true, message: "End location is required" },
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

              <div className="md:col-span-2">
                <Form.List name="stoppages">
                  {(fields, { add, remove }) => (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <label className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
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
                                  <button
                                    className="flex cursor-pointer items-center justify-center rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                                    title="Delete"
                                    onClick={() => remove(field.name)}
                                  >
                                    <FiTrash2 className="h-4 w-4 text-white" />
                                  </button>
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
                label={
                  <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                    Status
                  </span>
                }
              >
                <Select
                  size="large"
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                  className="rounded-lg"
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
                loading={saving}
                icon={<FiSave />}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700"
              >
                Update Route
              </Button>
            </div>
          </Form>
        </FormLoader>
      </div>
    </div>
  );
}
