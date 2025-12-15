"use client";

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { SeatEditor } from "../../seat-plans/components/SeatEditor";

const { useWatch } = Form;

export default function BusDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [seatPlans, setSeatPlans] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedSeatPlan, setSelectedSeatPlan] = useState<any>(null);

  // Watch seatPlan field
  const seatPlanId = useWatch("seatPlan", form);

  // Watch seats, rows, columns, and aisleColumns for editable seat editor
  const busSeats = useWatch("seats", form) || [];
  const busRows = useWatch("rows", form) || 10;
  const busColumns = useWatch("columns", form) || 5;
  const busAisleColumns = useWatch("aisleColumns", form) || [];

  // Debug logging
  useEffect(() => {
    console.log("SeatEditor props (from useWatch):", {
      busSeats: busSeats.length,
      busRows,
      busColumns,
      busAisleColumns: busAisleColumns.length,
      firstSeat: busSeats[0],
      allSeats: busSeats,
    });
  }, [busSeats, busRows, busColumns, busAisleColumns]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busRes, companiesRes, seatPlansRes] = await Promise.all([
          fetch(`/api/buses/${resolvedParams.id}`),
          fetch("/api/companies"),
          fetch("/api/seat-plans"),
        ]);

        if (busRes.ok) {
          const busData = await busRes.json();
          const seatPlanId =
            busData.seatPlan && typeof busData.seatPlan === "object"
              ? busData.seatPlan._id
              : busData.seatPlan;

          if (busData.company && typeof busData.company === "object") {
            busData.company = busData.company._id;
          }
          if (busData.seatPlan && typeof busData.seatPlan === "object") {
            busData.seatPlan = busData.seatPlan._id;
          }

          console.log("Raw bus data from API:", {
            hasSeats: !!busData.seats,
            seatsLength: busData.seats?.length || 0,
            hasSeatPlanLayout: !!busData.seatPlanLayout,
            seatPlanLayoutSeatsLength:
              busData.seatPlanLayout?.seats?.length || 0,
            seatPlanLayoutRows: busData.seatPlanLayout?.rows,
            seatPlanLayoutColumns: busData.seatPlanLayout?.columns,
            sampleSeat:
              busData.seats?.[0] || busData.seatPlanLayout?.seats?.[0],
          });

          // Set form values including seatPlan, seats, rows, columns, aisleColumns
          // Priority: bus.seats > bus.seatPlanLayout.seats > []
          const busSeatsData =
            busData.seats &&
            Array.isArray(busData.seats) &&
            busData.seats.length > 0
              ? busData.seats
              : busData.seatPlanLayout?.seats &&
                Array.isArray(busData.seatPlanLayout.seats) &&
                busData.seatPlanLayout.seats.length > 0
              ? busData.seatPlanLayout.seats
              : [];

          const busRowsData =
            busData.rows || busData.seatPlanLayout?.rows || 10;
          const busColumnsData =
            busData.columns || busData.seatPlanLayout?.columns || 5;
          const busAisleColumnsData =
            busData.aisleColumns || busData.seatPlanLayout?.aisleColumns || [];

          console.log("Processed bus data:", {
            finalSeats: busSeatsData.length,
            rows: busRowsData,
            columns: busColumnsData,
            aisleColumns: busAisleColumnsData.length,
            firstSeat: busSeatsData[0],
          });

          form.setFieldsValue({
            ...busData,
            seatPlan: seatPlanId || null,
            // Initialize seats, rows, columns, aisleColumns from bus data or seat plan layout
            seats: busSeatsData,
            rows: busRowsData,
            columns: busColumnsData,
            aisleColumns: busAisleColumnsData,
          });

          // Verify what was set in form
          setTimeout(() => {
            const formSeats = form.getFieldValue("seats");
            const formRows = form.getFieldValue("rows");
            const formColumns = form.getFieldValue("columns");
            console.log("Form values after setFieldsValue:", {
              seats: formSeats?.length || 0,
              rows: formRows,
              columns: formColumns,
            });
          }, 100);

          // If bus has a seat plan, fetch its details
          if (seatPlanId) {
            const seatPlanRes = await fetch(`/api/seat-plans/${seatPlanId}`);
            if (seatPlanRes.ok) {
              const seatPlanData = await seatPlanRes.json();
              setSelectedSeatPlan(seatPlanData);
            }
          }
        }

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
              ? data.map((sp: any) => ({
                  label: `${sp.name} (${sp.type})`,
                  value: sp._id,
                }))
              : []
          );
        }
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [resolvedParams.id, form]);

  // Fetch seat plan details when selected and optionally sync seats
  useEffect(() => {
    const fetchSeatPlanDetails = async () => {
      // Check if seatPlanId exists and is not empty string
      if (seatPlanId && seatPlanId !== "") {
        try {
          const res = await fetch(`/api/seat-plans/${seatPlanId}`);
          if (res.ok) {
            const data = await res.json();
            setSelectedSeatPlan(data);

            // Auto-update capacity if not set
            if (!form.getFieldValue("capacity") && data.seats) {
              const totalSeats = data.seats.filter(
                (s: any) => !s.isAisle
              ).length;
              form.setFieldValue("capacity", totalSeats);
            }

            // Only sync seats, rows, columns, aisleColumns if bus doesn't have them
            // Don't overwrite existing bus seats
            const currentSeats = form.getFieldValue("seats");
            const currentRows = form.getFieldValue("rows");
            const currentColumns = form.getFieldValue("columns");

            if (!currentSeats || currentSeats.length === 0) {
              form.setFieldsValue({
                seats: data.seats || [],
              });
            }
            if (!currentRows || currentRows === 10) {
              form.setFieldValue("rows", data.rows || 10);
            }
            if (!currentColumns || currentColumns === 5) {
              form.setFieldValue("columns", data.columns || 5);
            }
            if (
              !form.getFieldValue("aisleColumns") ||
              form.getFieldValue("aisleColumns").length === 0
            ) {
              form.setFieldValue("aisleColumns", data.aisleColumns || []);
            }
          }
        } catch {
          // Silently fail
        }
      } else {
        // Only clear if explicitly null/undefined, not if it's just not loaded yet
        if (seatPlanId === null || seatPlanId === undefined) {
          setSelectedSeatPlan(null);
        }
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
      // Get seatPlan from multiple sources to ensure we capture it
      const seatPlanFromValues = values.seatPlan;
      const seatPlanFromForm = form.getFieldValue("seatPlan");
      const seatPlanFromState = seatPlanId;

      // Use the first available value (prefer values.seatPlan from form submission)
      const seatPlanValue =
        seatPlanFromValues !== undefined
          ? seatPlanFromValues
          : seatPlanFromForm !== undefined
          ? seatPlanFromForm
          : seatPlanFromState;

      // Only set to null if explicitly null/empty, otherwise use the value
      payload.seatPlan =
        seatPlanValue !== undefined &&
        seatPlanValue !== null &&
        seatPlanValue !== ""
          ? seatPlanValue
          : null;

      // Get seats from form values (editable seats from SeatEditor)
      payload.seats = values.seats || form.getFieldValue("seats") || [];
      payload.rows = values.rows || form.getFieldValue("rows") || 10;
      payload.columns = values.columns || form.getFieldValue("columns") || 5;
      payload.aisleColumns =
        values.aisleColumns || form.getFieldValue("aisleColumns") || [];

      console.log("Submitting bus data:", payload);
      console.log("values.seatPlan:", values.seatPlan);
      console.log("form.getFieldValue('seatPlan'):", seatPlanFromForm);
      console.log("seatPlanId (from useWatch):", seatPlanFromState);
      console.log("Final seatPlanValue:", seatPlanValue);
      console.log("seatPlan in payload:", payload.seatPlan);
      console.log("seats in payload:", payload.seats?.length || 0);

      const res = await fetch(`/api/buses/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("API error:", error);
        throw new Error(error.message || "Failed to update bus");
      }

      toast.success("Bus updated successfully");
      router.push("/dashboard/buses");
    } catch (error: any) {
      console.error("Error updating bus:", error);
      toast.error(error.message || "Failed to update bus");
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
          Edit Bus
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update the comprehensive details of the bus
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
                Basic Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Form.Item
                  name="company"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Company</span>
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
                  name="number"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                      Bus Number / Code
                    </span>
                  }
                  rules={[
                    { required: true, message: "Bus number is required" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="e.g. DHAKA-TA-1234"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="registrationNumber"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                      Registration Number
                    </span>
                  }
                >
                  <Input
                    size="large"
                    placeholder="e.g. REG-2023-XYZ"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="brand"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Brand</span>
                  }
                >
                  <Input
                    size="large"
                    placeholder="e.g. Scania, Volvo"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="model"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Model</span>
                  }
                >
                  <Input
                    size="large"
                    placeholder="e.g. K410IB"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="status"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Status</span>
                  }
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
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
                Configuration
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <Form.Item
                  name="type"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">Bus Type</span>
                  }
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
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                      Seat Plan
                    </span>
                  }
                >
                  <Select
                    size="large"
                    placeholder="Select seat plan"
                    className="rounded-lg"
                    showSearch
                    optionFilterProp="label"
                    options={seatPlans}
                    allowClear
                    onChange={(value) => {
                      // Ensure the value is properly set in the form
                      form.setFieldValue("seatPlan", value || null);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="capacity"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                      Total Capacity
                    </span>
                  }
                  rules={[{ required: true, message: "Capacity is required" }]}
                >
                  <InputNumber
                    size="large"
                    min={1}
                    className="rounded-lg"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
                Documents & Compliance
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <Form.Item
                  name="fitnessExpiry"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                      Fitness Expiry
                    </span>
                  }
                >
                  <DatePicker size="large" className="w-full rounded-lg" />
                </Form.Item>

                <Form.Item
                  name="insuranceExpiry"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                      Insurance Expiry
                    </span>
                  }
                >
                  <DatePicker size="large" className="w-full rounded-lg" />
                </Form.Item>

                <Form.Item
                  name="taxTokenExpiry"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                      Tax Token Expiry
                    </span>
                  }
                >
                  <DatePicker size="large" className="w-full rounded-lg" />
                </Form.Item>

                <Form.Item
                  name="permitNumber"
                  label={
                    <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                      Permit Number
                    </span>
                  }
                >
                  <Input size="large" className="rounded-lg" />
                </Form.Item>
              </div>
            </div>

            <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
                Facilities
              </h3>
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
                Update Bus
              </Button>
            </div>
          </div>

          {/* Seat Layout Section - Side by Side */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
              Seat Layout
            </h3>
            <Form.Item name="seats" preserve>
              <SeatEditor
                value={Array.isArray(busSeats) ? busSeats : []}
                rows={busRows || 10}
                columns={busColumns || 5}
                aisleColumns={
                  Array.isArray(busAisleColumns) ? busAisleColumns : []
                }
                allowRowRemoval={false}
                onChange={(seats) => {
                  form.setFieldValue("seats", seats);
                }}
                onRowsChange={(rows) => {
                  form.setFieldValue("rows", rows);
                }}
                onColumnsChange={(columns) => {
                  form.setFieldValue("columns", columns);
                }}
                onAisleColumnsChange={(aisleColumns) => {
                  form.setFieldValue("aisleColumns", aisleColumns);
                }}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
}
