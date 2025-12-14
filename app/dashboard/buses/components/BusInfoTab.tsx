"use client";

import { Form, Input, InputNumber, Select, DatePicker, Checkbox, Button } from "antd";
import { FiSave } from "react-icons/fi";
import { useEffect, useState } from "react";

interface BusInfoTabProps {
  bus: any;
  form: any;
  companies: { label: string; value: string }[];
  onFinish: (values: any) => void;
  loading: boolean;
}

export function BusInfoTab({ bus, form, companies, onFinish, loading }: BusInfoTabProps) {
  const [seatPlans, setSeatPlans] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchSeatPlans = async () => {
      try {
        const res = await fetch("/api/seat-plans");
        if (res.ok) {
          const data = await res.json();
          setSeatPlans(
            Array.isArray(data)
              ? data.map((sp: any) => ({ label: `${sp.name} (${sp.type})`, value: sp._id }))
              : []
          );
        }
      } catch {
        // Silently fail
      }
    };
    fetchSeatPlans();
  }, []);

  const facilitiesOptions = [
    { label: "WiFi", value: "WiFi" },
    { label: "Water", value: "Water" },
    { label: "Blanket", value: "Blanket" },
    { label: "Charging Port", value: "Charging Port" },
    { label: "TV", value: "TV" },
    { label: "Reading Light", value: "Reading Light" },
    { label: "Snacks", value: "Snacks" },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Basic Information</h3>
          <div className="mb-6">
            <Form.Item name="company" label="Company" rules={[{ required: true }]}>
              <Select size="large" options={companies} className="rounded-lg w-full" showSearch />
            </Form.Item>
          </div>
          <div className="mb-6">
            <Form.Item name="number" label="Bus Number" rules={[{ required: true }]}>
              <Input size="large" className="rounded-lg w-full" />
            </Form.Item>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Form.Item name="registrationNumber" label="Registration Number">
              <Input size="large" className="rounded-lg" />
            </Form.Item>
            <Form.Item name="brand" label="Brand">
              <Input size="large" className="rounded-lg" />
            </Form.Item>
            <Form.Item name="model" label="Model">
              <Input size="large" className="rounded-lg" />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select size="large" options={[
                { label: "Active", value: "Active" },
                { label: "Maintenance", value: "Maintenance" },
                { label: "Inactive", value: "Inactive" },
              ]} className="rounded-lg" />
            </Form.Item>
          </div>
        </div>

        <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Configuration</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select size="large" options={[
                { label: "AC", value: "AC" },
                { label: "Non-AC", value: "Non-AC" },
                { label: "Sleeper", value: "Sleeper" },
                { label: "Seater", value: "Seater" },
                { label: "Double Decker", value: "Double Decker" },
              ]} className="rounded-lg" />
            </Form.Item>
            <Form.Item name="seatPlan" label="Seat Plan">
              <Select 
                size="large" 
                options={seatPlans}
                className="rounded-lg"
                showSearch
                optionFilterProp="label"
                placeholder="Select seat plan"
              />
            </Form.Item>
            <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
              <InputNumber size="large" min={1} className="rounded-lg" style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </div>

        <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Documents & Compliance</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Form.Item name="fitnessExpiry" label="Fitness Expiry">
              <DatePicker size="large" className="w-full rounded-lg" />
            </Form.Item>
            <Form.Item name="insuranceExpiry" label="Insurance Expiry">
              <DatePicker size="large" className="w-full rounded-lg" />
            </Form.Item>
            <Form.Item name="taxTokenExpiry" label="Tax Token Expiry">
              <DatePicker size="large" className="w-full rounded-lg" />
            </Form.Item>
            <Form.Item name="permitNumber" label="Permit Number">
              <Input size="large" className="rounded-lg" />
            </Form.Item>
          </div>
        </div>

        <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Facilities</h3>
          <Form.Item name="facilities">
            <Checkbox.Group options={facilitiesOptions} />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-4">
          <Button size="large" className="rounded-lg">Cancel</Button>
          <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<FiSave />} className="rounded-lg bg-indigo-600">
            Update Bus
          </Button>
        </div>
      </Form>
    </div>
  );
}

