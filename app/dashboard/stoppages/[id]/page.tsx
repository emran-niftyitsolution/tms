"use client";

import { Button, Checkbox, Form, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { FormLoader } from "../../components/Loader";

export default function EditStoppagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stoppageRes, companiesRes, citiesRes] = await Promise.all([
          fetch(`/api/stoppages/${resolvedParams.id}`),
          fetch("/api/companies"),
          fetch("/api/cities"),
        ]);

        if (stoppageRes.ok) {
          const stoppage = await stoppageRes.json();
          if (stoppage.company && typeof stoppage.company === "object") {
            stoppage.company = stoppage.company._id;
          }
          if (stoppage.city && typeof stoppage.city === "object") {
            stoppage.city = stoppage.city._id;
          }
          // Ensure boolean values are explicitly set
          form.setFieldsValue({
            ...stoppage,
            boarding: stoppage.boarding ?? false,
            dropping: stoppage.dropping ?? false,
            counter: stoppage.counter ?? false,
          });
        } else {
          toast.error("Failed to load stoppage details");
          router.push("/dashboard/stoppages");
        }

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
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [resolvedParams.id, form, router]);

  const onFinish = async (values: any) => {
    setSubmitLoading(true);
    try {
      // Ensure boolean fields are explicitly set and converted to boolean
      const payload = {
        ...values,
        boarding: Boolean(values.boarding ?? false),
        dropping: Boolean(values.dropping ?? false),
        counter: Boolean(values.counter ?? false),
      };

      const res = await fetch(`/api/stoppages/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update stoppage");
      }

      toast.success("Stoppage updated successfully");
      router.push("/dashboard/stoppages");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Edit Stoppage
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update stoppage information
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <FormLoader loading={pageLoading}>
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
                rules={[
                  { required: true, message: "Stoppage name is required" },
                ]}
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
                  <Form.Item name="boarding" valuePropName="checked">
                    <Checkbox className="text-slate-700 dark:text-white dark:text-slate-300">
                      Boarding
                    </Checkbox>
                  </Form.Item>
                  <Form.Item name="dropping" valuePropName="checked">
                    <Checkbox className="text-slate-700 dark:text-white dark:text-slate-300">
                      Dropping
                    </Checkbox>
                  </Form.Item>
                  <Form.Item name="counter" valuePropName="checked">
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
                loading={submitLoading}
                icon={<FiSave />}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700"
              >
                Update Stoppage
              </Button>
            </div>
          </Form>
        </FormLoader>
      </div>
    </div>
  );
}
