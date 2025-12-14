"use client";

import {
  Breadcrumb,
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Table,
  Tabs,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FiCalendar, FiInfo, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { RouteSchedulesTab } from "../components/RouteSchedulesTab";
import { FormLoader } from "../../components/Loader";

export default function RouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState("info");
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [stoppages, setStoppages] = useState<
    { label: string; value: string }[]
  >([]);
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    fetchRouteData();
  }, [resolvedParams.id]);

  const fetchRouteData = async () => {
    setLoading(true);
    try {
      const [routeRes, companiesRes, stoppagesRes, schedulesRes] =
        await Promise.all([
          fetch(`/api/routes/${resolvedParams.id}`),
          fetch("/api/companies"),
          fetch("/api/stoppages"),
          fetch(`/api/schedules?routeId=${resolvedParams.id}`),
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

      if (schedulesRes.ok) {
        const data = await schedulesRes.json();
        setSchedules(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onRouteUpdate = async (values: any) => {
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
    }
  };

  if (!route && !loading) return <div className="text-center py-12">Route not found</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/routes">Routes</Link> },
          { title: route?.name || "Loading..." },
        ]}
        className="mb-4"
      />

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {route?.name || "Loading..."}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {route ? `${route.from?.name || route.from} → ${route.to?.name || route.to}` : "Loading route details..."}
            </p>
          </div>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "info",
            label: (
              <span className="flex items-center gap-2">
                <FiInfo /> Route Information
              </span>
            ),
            children: (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
                <FormLoader loading={loading}>
                  <Form form={form} layout="vertical" onFinish={onRouteUpdate}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Form.Item
                      name="company"
                      label="Company"
                      rules={[
                        { required: true, message: "Company is required" },
                      ]}
                      className="md:col-span-2"
                    >
                      <Select
                        size="large"
                        options={companies}
                        className="rounded-lg"
                        showSearch
                        optionFilterProp="label"
                      />
                    </Form.Item>

                    <Form.Item
                      name="name"
                      label="Route Name"
                      rules={[
                        { required: true, message: "Route name is required" },
                      ]}
                      className="md:col-span-2"
                    >
                      <Input size="large" className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                      name="from"
                      label="From"
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
                      label="To"
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

                    <Form.Item name="status" label="Status">
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
                      className="rounded-lg bg-indigo-600"
                    >
                      Update Route
                    </Button>
                  </div>
                </Form>
                </FormLoader>
              </div>
            ),
          },
          {
            key: "schedules",
            label: (
              <span className="flex items-center gap-2">
                <FiCalendar /> Schedules ({schedules.length})
              </span>
            ),
            children: (
              <RouteSchedulesTab
                schedules={schedules}
                routeId={resolvedParams.id}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
