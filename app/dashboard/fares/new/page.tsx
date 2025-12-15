"use client";

import { Button, Form, InputNumber, Select } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";

export default function NewFarePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);
  const [seatClasses, setSeatClasses] = useState<{ label: string; value: string }[]>([]);
  const [routes, setRoutes] = useState<{ label: string; value: string }[]>([]);
  const [filteredSeatClasses, setFilteredSeatClasses] = useState<{ label: string; value: string }[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, seatClassesRes, routesRes] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/seat-classes"),
          fetch("/api/routes"),
        ]);

        if (companiesRes.ok) {
          const data = await companiesRes.json();
          setCompanies(
            Array.isArray(data)
              ? data.map((c: any) => ({ label: c.name, value: c._id }))
              : []
          );
        }

        if (seatClassesRes.ok) {
          const data = await seatClassesRes.json();
          const seatClassOptions = Array.isArray(data)
            ? data.map((sc: any) => ({
                label: `${sc.name} (৳${sc.fare?.toLocaleString()})`,
                value: sc._id,
                company: typeof sc.company === 'object' && sc.company !== null ? sc.company._id : sc.company,
                baseFare: sc.fare,
              }))
            : [];
          setSeatClasses(seatClassOptions);
          setFilteredSeatClasses(seatClassOptions);
        }

        if (routesRes.ok) {
          const data = await routesRes.json();
          const routeOptions = Array.isArray(data)
            ? data.map((r: any) => ({
                label: `${r.name} (${typeof r.from === 'object' ? r.from.name : r.from} - ${typeof r.to === 'object' ? r.to.name : r.to})`,
                value: r._id,
                company: typeof r.company === 'object' && r.company !== null ? r.company._id : r.company,
              }))
            : [];
          setRoutes(routeOptions);
          setFilteredRoutes(routeOptions);
        }
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // Filter seat classes and routes based on selected company
  const handleCompanyChange = (companyId: string) => {
    if (companyId) {
      const filteredSC = seatClasses.filter((sc: any) => sc.company === companyId);
      const filteredR = routes.filter((r: any) => r.company === companyId);
      setFilteredSeatClasses(filteredSC);
      setFilteredRoutes(filteredR);
      // Clear selections when company changes
      form.setFieldsValue({ seatClass: undefined, route: undefined });
    } else {
      setFilteredSeatClasses(seatClasses);
      setFilteredRoutes(routes);
    }
  };

  // Auto-fill fare when seat class is selected
  const handleSeatClassChange = (seatClassId: string) => {
    const selectedSeatClass = seatClasses.find((sc: any) => sc.value === seatClassId);
    if (selectedSeatClass && selectedSeatClass.baseFare) {
      form.setFieldsValue({ fare: selectedSeatClass.baseFare });
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Ensure fare is a number
      if (values.fare) {
        values.fare = Number(values.fare);
      }

      const res = await fetch("/api/fares", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create fare");
      }

      toast.success("Fare created successfully");
      router.push("/dashboard/fares");
    } catch (error: any) {
      toast.error(error.message || "Failed to create fare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Add New Fare
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create a fare configuration for a route and seat class
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Basic Information
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Form.Item
                name="company"
                label={<span className="font-medium text-slate-600 dark:text-slate-300">Company</span>}
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
                  onChange={handleCompanyChange}
                />
              </Form.Item>

              <Form.Item
                name="route"
                label={<span className="font-medium text-slate-600 dark:text-slate-300">Route</span>}
                rules={[{ required: true, message: "Route is required" }]}
              >
                <Select
                  size="large"
                  placeholder="Select route"
                  className="rounded-lg"
                  showSearch
                  optionFilterProp="label"
                  options={filteredRoutes}
                  disabled={filteredRoutes.length === 0}
                />
              </Form.Item>

              <Form.Item
                name="seatClass"
                label={<span className="font-medium text-slate-600 dark:text-slate-300">Seat Class</span>}
                rules={[{ required: true, message: "Seat class is required" }]}
              >
                <Select
                  size="large"
                  placeholder="Select seat class"
                  className="rounded-lg"
                  showSearch
                  optionFilterProp="label"
                  options={filteredSeatClasses}
                  disabled={filteredSeatClasses.length === 0}
                  onChange={handleSeatClassChange}
                />
              </Form.Item>
            </div>
          </div>

          <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Fare Details
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Form.Item
                name="fare"
                label={<span className="font-medium text-slate-600 dark:text-slate-300">Fare (৳)</span>}
                rules={[
                  { required: true, message: "Fare is required" },
                  { type: "number", min: 0, message: "Fare must be a positive number" },
                ]}
              >
                <InputNumber
                  size="large"
                  placeholder="Enter fare amount"
                  className="rounded-lg w-full"
                  min={0}
                  formatter={(value) => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/৳\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                name="status"
                label={<span className="font-medium text-slate-600 dark:text-slate-300">Status</span>}
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
              Create Fare
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

