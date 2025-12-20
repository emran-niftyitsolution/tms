"use client";

import { Button, Form, Input, InputNumber, Select } from "antd";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { SeatEditor } from "../components/SeatEditor";

const { useWatch } = Form;

export default function EditSeatPlanPage({
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
  const [currentSeats, setCurrentSeats] = useState<any[]>([]);

  // Watch rows and columns to update seat layout reactively
  const rows = useWatch("rows", form) || 10;
  const columns = useWatch("columns", form) || 5;
  const aisleColumns = useWatch("aisleColumns", form) || [];
  const seats = useWatch("seats", form) || [];

  // Sync currentSeats with form seats
  useEffect(() => {
    if (Array.isArray(seats)) {
      setCurrentSeats(seats);
    }
  }, [seats]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seatPlanRes, companiesRes] = await Promise.all([
          fetch(`/api/seat-plans/${resolvedParams.id}`),
          fetch("/api/companies"),
        ]);

        if (seatPlanRes.ok) {
          const data = await seatPlanRes.json();
          if (data.company && typeof data.company === "object") {
            data.company = data.company._id;
          }
          form.setFieldsValue(data);
        } else {
          toast.error("Failed to load seat plan");
          router.push("/dashboard/seat-plans");
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
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [resolvedParams.id, form, router]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log("Form submitted with values:", values);

      // Explicitly get seats from form field value (since SeatEditor is a custom component)
      const formSeats = form.getFieldValue("seats");
      console.log("Form seats:", formSeats);
      console.log("Current seats:", currentSeats);

      // Get existing seats (prioritize form field value, then currentSeats state)
      const existingSeats = Array.isArray(formSeats)
        ? formSeats
        : Array.isArray(currentSeats)
        ? currentSeats
        : [];

      // Generate all seats for the grid based on rows and columns
      const numRows = values.rows || 10;
      const numColumns = values.columns || 5;
      const allSeats: any[] = [];
      let seatNumber = 1;

      for (let row = 0; row < numRows; row++) {
        for (let column = 0; column < numColumns; column++) {
          // Check if there's an existing seat at this position
          const existingSeat = existingSeats.find(
            (s: any) => s.row === row && s.column === column
          );

          if (existingSeat) {
            // Use existing seat but update seat number if it's not an aisle
            const seat: any = { ...existingSeat };
            if (!seat.isAisle) {
              seat.seatNumber = seatNumber++;
            }
            allSeats.push(seat);
          } else {
            // Create a new default seat for this position
            const newSeat: any = {
              row,
              column,
              isBroken: false,
              isAisle: false,
            };

            // Assign seat number only to non-aisle seats
            if (!newSeat.isAisle) {
              newSeat.seatNumber = seatNumber++;
            }

            allSeats.push(newSeat);
          }
        }
      }

      const payload = {
        ...values,
        seats: allSeats,
        rows: numRows,
        columns: numColumns,
        aisleColumns: Array.isArray(values.aisleColumns)
          ? values.aisleColumns
          : [],
      };

      // Calculate totalSeats from seats array (excluding aisles)
      payload.totalSeats = payload.seats.filter((s: any) => !s.isAisle).length;

      console.log("Payload being sent:", payload);

      const res = await fetch(`/api/seat-plans/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("API error:", error);
        throw new Error(error.message || "Failed to update seat plan");
      }

      const result = await res.json();
      console.log("Update successful:", result);

      toast.success("Seat plan updated successfully");
      router.push("/dashboard/seat-plans");
    } catch (error: any) {
      console.error("Error updating seat plan:", error);
      toast.error(error.message || "Failed to update seat plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Edit Seat Plan
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update seat configuration
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={(errorInfo) => {
              console.error("Form validation failed:", errorInfo);
              toast.error("Please fill in all required fields");
            }}
          >
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
              name="name"
              label={
                <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                  Plan Name
                </span>
              }
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input
                size="large"
                placeholder="e.g. 40 Seat Standard"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="type"
              label={
                <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                  Bus Type
                </span>
              }
              rules={[{ required: true, message: "Type is required" }]}
            >
              <Select
                size="large"
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

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="rows"
                label={
                  <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                    Rows
                  </span>
                }
                rules={[{ required: true, message: "Rows is required" }]}
              >
                <InputNumber
                  size="large"
                  min={1}
                  max={50}
                  className="rounded-lg"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="columns"
                label={
                  <span className="font-medium text-slate-600 dark:text-white dark:text-slate-300">
                    Columns
                  </span>
                }
                rules={[{ required: true, message: "Columns is required" }]}
              >
                <InputNumber
                  size="large"
                  min={2}
                  max={10}
                  className="rounded-lg"
                  style={{ width: "100%" }}
                />
              </Form.Item>
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
                className="rounded-lg"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </Form.Item>

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
                onClick={async (e) => {
                  console.log("Update button clicked");
                  e.preventDefault();
                  e.stopPropagation();

                  try {
                    // Validate form first
                    const values = await form.validateFields();
                    console.log("Form validation passed, submitting...");
                    await onFinish(values);
                  } catch (errorInfo: any) {
                    console.error("Form validation failed:", errorInfo);
                    if (errorInfo.errorFields) {
                      toast.error("Please fill in all required fields");
                    } else {
                      // If it's not a validation error, it might be the onFinish error
                      console.error("Submission error:", errorInfo);
                    }
                  }
                }}
              >
                Update Plan
              </Button>
            </div>
          </Form>
        </div>

        {/* Seat Layout Section */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Seat Layout
          </h3>
          <Form form={form}>
            <Form.Item name="seats" preserve initialValue={[]}>
              <SeatEditor
                value={seats}
                rows={rows}
                columns={columns}
                aisleColumns={aisleColumns}
                onChange={(seats) => {
                  setCurrentSeats(seats);
                  form.setFieldValue("seats", seats);
                }}
                onRowsChange={(rows) => form.setFieldValue("rows", rows)}
                onColumnsChange={(columns) =>
                  form.setFieldValue("columns", columns)
                }
                onAisleColumnsChange={(aisleColumns) =>
                  form.setFieldValue("aisleColumns", aisleColumns)
                }
              />
            </Form.Item>
            {/* Hidden field to track aisleColumns */}
            <Form.Item
              name="aisleColumns"
              preserve
              initialValue={[]}
              style={{ display: "none" }}
            >
              <Input type="hidden" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
