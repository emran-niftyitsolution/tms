"use client";

import { Button, Form, Input, InputNumber, Select, DatePicker, Checkbox } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { SeatEditor } from "../../seat-plans/components/SeatEditor";

const { useWatch } = Form;

export default function NewBusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>(
    []
  );
  const [seatPlans, setSeatPlans] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedSeatPlan, setSelectedSeatPlan] = useState<any>(null);

  // Watch seatPlan field
  const seatPlanId = useWatch("seatPlan", form);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, seatPlansRes] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/seat-plans"),
        ]);
        
        if (companiesRes.ok) {
          const data = await companiesRes.json();
          setCompanies(
            Array.isArray(data)
              ? data.map((c: any) => ({ label: c.name, value: c._id }))
              : []
          );
        }
        
        if (seatPlansRes.ok) {
          const data = await seatPlansRes.json();
          setSeatPlans(
            Array.isArray(data)
              ? data.map((sp: any) => ({ label: `${sp.name} (${sp.type})`, value: sp._id }))
              : []
          );
        }
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // Fetch seat plan details when selected
  useEffect(() => {
    const fetchSeatPlanDetails = async () => {
      if (seatPlanId) {
        try {
          const res = await fetch(`/api/seat-plans/${seatPlanId}`);
          if (res.ok) {
            const data = await res.json();
            setSelectedSeatPlan(data);
            // Auto-update capacity if not set
            if (!form.getFieldValue("capacity") && data.seats) {
              const totalSeats = data.seats.filter((s: any) => !s.isAisle).length;
              form.setFieldValue("capacity", totalSeats);
            }
          }
        } catch {
          // Silently fail
        }
      } else {
        setSelectedSeatPlan(null);
      }
    };
    fetchSeatPlanDetails();
  }, [seatPlanId, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Convert date objects to ISO strings if they exist
      const payload: any = { ...values };
      if (payload.fitnessExpiry && payload.fitnessExpiry.toISOString) {
        payload.fitnessExpiry = payload.fitnessExpiry.toISOString();
      }
      if (payload.insuranceExpiry && payload.insuranceExpiry.toISOString) {
        payload.insuranceExpiry = payload.insuranceExpiry.toISOString();
      }
      if (payload.taxTokenExpiry && payload.taxTokenExpiry.toISOString) {
        payload.taxTokenExpiry = payload.taxTokenExpiry.toISOString();
      }
      
      // Ensure capacity is a number
      if (payload.capacity) {
        payload.capacity = Number(payload.capacity);
      }
      
      // Send seatPlan and seats separately
      payload.seatPlan = values.seatPlan || null;
      payload.seats = selectedSeatPlan?.seats || [];
      
      console.log("Submitting bus data:", payload);
      console.log("seatPlan in payload:", payload.seatPlan);
      console.log("seats in payload:", payload.seats?.length || 0);
      
      const res = await fetch("/api/buses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("API error:", error);
        throw new Error(error.message || "Failed to create bus");
      }

      toast.success("Bus created successfully");
      router.push("/dashboard/buses");
    } catch (error: any) {
      console.error("Error creating bus:", error);
      toast.error(error.message || "Failed to create bus");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Add New Bus
        </h2>
        <p className="text-sm text-slate-500">
          Enter the comprehensive details of the new bus
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
          <Form form={form} layout="vertical" onFinish={onFinish}>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Basic Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Form.Item
                name="company"
                label={<span className="font-medium text-slate-600">Company</span>}
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
                name="number"
                label={<span className="font-medium text-slate-600">Bus Number / Code</span>}
                rules={[{ required: true, message: "Bus number is required" }]}
              >
                <Input size="large" placeholder="e.g. DHAKA-TA-1234" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                name="registrationNumber"
                label={<span className="font-medium text-slate-600">Registration Number</span>}
              >
                <Input size="large" placeholder="e.g. REG-2023-XYZ" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                name="brand"
                label={<span className="font-medium text-slate-600">Brand</span>}
              >
                <Input size="large" placeholder="e.g. Scania, Volvo" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                name="model"
                label={<span className="font-medium text-slate-600">Model</span>}
              >
                <Input size="large" placeholder="e.g. K410IB" className="rounded-lg" />
              </Form.Item>

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
                    { label: "Maintenance", value: "Maintenance" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </Form.Item>
            </div>
          </div>

          <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Configuration</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Form.Item
                name="type"
                label={<span className="font-medium text-slate-600">Bus Type</span>}
                rules={[{ required: true, message: "Bus type is required" }]}
              >
                <Select
                  size="large"
                  placeholder="Select type"
                  className="rounded-lg"
                  options={[
                    { label: "AC", value: "AC" },
                    { label: "Non-AC", value: "Non-AC" },
                    { label: "Sleeper", value: "Sleeper" },
                    { label: "Seater", value: "Seater" },
                    { label: "Double Decker", value: "Double Decker" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="seatPlan"
                label={<span className="font-medium text-slate-600">Seat Plan</span>}
              >
                <Select
                  size="large"
                  placeholder="Select seat plan"
                  className="rounded-lg"
                  showSearch
                  optionFilterProp="label"
                  options={seatPlans}
                />
              </Form.Item>

               <Form.Item
                name="capacity"
                label={<span className="font-medium text-slate-600">Total Capacity</span>}
                rules={[{ required: true, message: "Capacity is required" }]}
              >
                <InputNumber size="large" min={1} className="rounded-lg" style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </div>

          <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Documents & Compliance</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Form.Item
                name="fitnessExpiry"
                label={<span className="font-medium text-slate-600">Fitness Expiry</span>}
              >
                <DatePicker size="large" className="w-full rounded-lg" />
              </Form.Item>

              <Form.Item
                name="insuranceExpiry"
                label={<span className="font-medium text-slate-600">Insurance Expiry</span>}
              >
                <DatePicker size="large" className="w-full rounded-lg" />
              </Form.Item>

              <Form.Item
                name="taxTokenExpiry"
                label={<span className="font-medium text-slate-600">Tax Token Expiry</span>}
              >
                <DatePicker size="large" className="w-full rounded-lg" />
              </Form.Item>

              <Form.Item
                name="permitNumber"
                label={<span className="font-medium text-slate-600">Permit Number</span>}
              >
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
              Create Bus
            </Button>
          </div>
        </Form>
      </div>

        {/* Seat Plan Layout Section */}
        {selectedSeatPlan && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Seat Plan Layout
            </h3>
            <div className="text-sm text-slate-500 mb-4">
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {selectedSeatPlan.name} ({selectedSeatPlan.type})
              </p>
              <p className="mt-1">
                {selectedSeatPlan.rows} rows × {selectedSeatPlan.columns} columns
              </p>
            </div>
            <SeatEditor
              value={selectedSeatPlan.seats || []}
              rows={selectedSeatPlan.rows || 10}
              columns={selectedSeatPlan.columns || 5}
              aisleColumns={selectedSeatPlan.aisleColumns || []}
              readOnly={true}
              onChange={() => {}} // Read-only
              onRowsChange={() => {}} // Read-only
              onColumnsChange={() => {}} // Read-only
              onAisleColumnsChange={() => {}} // Read-only
            />
          </div>
        )}
      </div>
    </div>
  );
}

