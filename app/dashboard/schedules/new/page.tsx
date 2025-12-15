"use client";

import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { SeatEditor } from "../../seat-plans/components/SeatEditor";

const { useWatch } = Form;

function NewScheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [buses, setBuses] = useState<{ label: string; value: string }[]>([]);
  const [routes, setRoutes] = useState<{ label: string; value: string }[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedBus, setSelectedBus] = useState<any>(null);

  // Watch bus field and seats field
  const selectedBusId = useWatch("bus", form);
  const formSeats = useWatch("seats", form) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, busesRes, routesRes] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/buses"),
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

        if (busesRes.ok) {
          const data = await busesRes.json();
          const busOptions = Array.isArray(data)
            ? data.map((b: any) => ({
                label: `${b.number} (${b.type})`,
                value: b._id,
                company:
                  typeof b.company === "object" && b.company !== null
                    ? b.company._id
                    : b.company,
              }))
            : [];
          setBuses(busOptions);
          setFilteredBuses(busOptions);
        }

        if (routesRes.ok) {
          const data = await routesRes.json();
          setRoutes(
            Array.isArray(data)
              ? data.map((r: any) => ({
                  label: `${r.name} (${
                    typeof r.from === "object" ? r.from.name : r.from
                  } - ${typeof r.to === "object" ? r.to.name : r.to})`,
                  value: r._id,
                }))
              : []
          );
        }

        // Pre-fill form if busId or routeId in query params
        const busId = searchParams.get("busId");
        const routeId = searchParams.get("routeId");
        if (busId) form.setFieldsValue({ bus: busId });
        if (routeId) form.setFieldsValue({ route: routeId });
      } catch {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [searchParams, form]);

  // Filter buses based on selected company
  const handleCompanyChange = (companyId: string) => {
    if (companyId) {
      const filtered = buses.filter((b: any) => b.company === companyId);
      setFilteredBuses(filtered);
      // Clear bus selection when company changes
      form.setFieldsValue({ bus: undefined });
      setSelectedBus(null);
    } else {
      setFilteredBuses(buses);
    }
  };

  // Fetch bus details when bus is selected
  useEffect(() => {
    const fetchBusDetails = async () => {
      if (selectedBusId) {
        try {
          const res = await fetch(`/api/buses/${selectedBusId}`);
          if (res.ok) {
            const busData = await res.json();

            // Process seat data with priority: bus.seats > bus.seatPlanLayout.seats > bus.seatPlan.seats
            let busSeatsData =
              busData.seats &&
              Array.isArray(busData.seats) &&
              busData.seats.length > 0
                ? busData.seats
                : busData.seatPlanLayout?.seats &&
                  Array.isArray(busData.seatPlanLayout.seats) &&
                  busData.seatPlanLayout.seats.length > 0
                ? busData.seatPlanLayout.seats
                : busData.seatPlan?.seats &&
                  Array.isArray(busData.seatPlan.seats) &&
                  busData.seatPlan.seats.length > 0
                ? busData.seatPlan.seats
                : [];

            // Clean seats data - remove MongoDB _id and ensure proper format
            busSeatsData = busSeatsData.map((seat: any) => ({
              row: Number(seat.row),
              column: Number(seat.column),
              seatNumber: Number(seat.seatNumber),
              seatName: seat.seatName || undefined,
              isBroken: Boolean(seat.isBroken),
              isAisle: Boolean(seat.isAisle),
            }));

            // Process rows, columns, aisleColumns with proper fallbacks and ensure they are numbers
            const busRowsData = Number(
              busData.rows ||
                busData.seatPlanLayout?.rows ||
                busData.seatPlan?.rows ||
                10
            );
            const busColumnsData = Number(
              busData.columns ||
                busData.seatPlanLayout?.columns ||
                busData.seatPlan?.columns ||
                5
            );
            const busAisleColumnsData =
              Array.isArray(busData.aisleColumns) &&
              busData.aisleColumns.length > 0
                ? busData.aisleColumns
                : Array.isArray(busData.seatPlanLayout?.aisleColumns) &&
                  busData.seatPlanLayout.aisleColumns.length > 0
                ? busData.seatPlanLayout.aisleColumns
                : Array.isArray(busData.seatPlan?.aisleColumns) &&
                  busData.seatPlan.aisleColumns.length > 0
                ? busData.seatPlan.aisleColumns
                : [];

            // Create a normalized bus object with all seat data
            const normalizedBusData = {
              ...busData,
              seats: busSeatsData,
              rows: busRowsData,
              columns: busColumnsData,
              aisleColumns: busAisleColumnsData,
            };

            console.log("Normalized bus data for schedule:", {
              seatsCount: busSeatsData.length,
              rows: busRowsData,
              columns: busColumnsData,
              aisleColumns: busAisleColumnsData,
              sampleSeat: busSeatsData[0],
            });

            setSelectedBus(normalizedBusData);

            // Set seats in form (always set, even if empty array)
            form.setFieldsValue({ seats: busSeatsData });
          }
        } catch (error) {
          console.error("Error fetching bus details:", error);
        }
      } else {
        setSelectedBus(null);
        form.setFieldsValue({ seats: [] });
      }
    };
    fetchBusDetails();
  }, [selectedBusId, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Convert date objects to ISO strings if they exist
      const payload: any = { ...values };
      if (payload.departureTime && payload.departureTime.toISOString) {
        payload.departureTime = payload.departureTime.toISOString();
      }
      if (payload.arrivalTime && payload.arrivalTime.toISOString) {
        payload.arrivalTime = payload.arrivalTime.toISOString();
      }

      // Ensure price is a number
      if (payload.price) {
        payload.price = Number(payload.price);
      }

      // Include seats from form (prioritize form seats over bus seats)
      // This allows users to edit seats for this specific schedule
      if (
        !payload.seats ||
        !Array.isArray(payload.seats) ||
        payload.seats.length === 0
      ) {
        // Fallback to form seats, then bus seats
        payload.seats =
          formSeats.length > 0
            ? formSeats
            : selectedBus?.seats ||
              selectedBus?.seatPlanLayout?.seats ||
              selectedBus?.seatPlan?.seats ||
              [];
      }

      // Ensure seats array is properly formatted (clean any extra fields)
      if (payload.seats && Array.isArray(payload.seats)) {
        payload.seats = payload.seats.map((seat: any) => ({
          row: Number(seat.row),
          column: Number(seat.column),
          seatNumber: Number(seat.seatNumber),
          seatName: seat.seatName || undefined,
          isBroken: Boolean(seat.isBroken),
          isAisle: Boolean(seat.isAisle),
        }));
      }

      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create schedule");
      }

      toast.success("Schedule created successfully");
      router.push("/dashboard/schedules");
    } catch (error: any) {
      toast.error(error.message || "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Add New Schedule
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create a new trip schedule with bus, route, and timing details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
                Basic Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Form.Item
                  name="company"
                  label={
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Company
                    </span>
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
                    onChange={handleCompanyChange}
                  />
                </Form.Item>

                <Form.Item
                  name="bus"
                  label={
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Bus
                    </span>
                  }
                  rules={[{ required: true, message: "Bus is required" }]}
                >
                  <Select
                    size="large"
                    placeholder="Select bus"
                    className="rounded-lg"
                    showSearch
                    optionFilterProp="label"
                    options={filteredBuses}
                    disabled={filteredBuses.length === 0}
                  />
                </Form.Item>

                <Form.Item
                  name="route"
                  label={
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Route
                    </span>
                  }
                  rules={[{ required: true, message: "Route is required" }]}
                >
                  <Select
                    size="large"
                    placeholder="Select route"
                    className="rounded-lg"
                    showSearch
                    optionFilterProp="label"
                    options={routes}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
                Schedule Details
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Form.Item
                  name="departureTime"
                  label={
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Departure Time
                    </span>
                  }
                  rules={[
                    { required: true, message: "Departure time is required" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue("arrivalTime")) {
                          return Promise.resolve();
                        }
                        if (
                          dayjs(value).isAfter(
                            dayjs(getFieldValue("arrivalTime"))
                          )
                        ) {
                          return Promise.reject(
                            new Error(
                              "Departure time must be before arrival time"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    size="large"
                    className="w-full rounded-lg"
                    format="YYYY-MM-DD HH:mm"
                    placeholder="Select departure date and time"
                  />
                </Form.Item>

                <Form.Item
                  name="arrivalTime"
                  label={
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Arrival Time
                    </span>
                  }
                  rules={[
                    { required: true, message: "Arrival time is required" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue("departureTime")) {
                          return Promise.resolve();
                        }
                        if (
                          dayjs(value).isBefore(
                            dayjs(getFieldValue("departureTime"))
                          )
                        ) {
                          return Promise.reject(
                            new Error(
                              "Arrival time must be after departure time"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    size="large"
                    className="w-full rounded-lg"
                    format="YYYY-MM-DD HH:mm"
                    placeholder="Select arrival date and time"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="mb-6 border-t pt-6 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
                Pricing & Status
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Form.Item
                  name="price"
                  label={
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Ticket Price (৳)
                    </span>
                  }
                  rules={[
                    { required: true, message: "Price is required" },
                    {
                      type: "number",
                      min: 0,
                      message: "Price must be a positive number",
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    placeholder="e.g. 500"
                    className="rounded-lg w-full"
                    min={0}
                  />
                </Form.Item>

                <Form.Item
                  name="status"
                  label={
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Status
                    </span>
                  }
                  initialValue="Scheduled"
                >
                  <Select
                    size="large"
                    className="rounded-lg"
                    options={[
                      { label: "Scheduled", value: "Scheduled" },
                      { label: "Delayed", value: "Delayed" },
                      { label: "Completed", value: "Completed" },
                      { label: "Cancelled", value: "Cancelled" },
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
                Create Schedule
              </Button>
            </div>
          </Form>
        </div>

        {/* Seat Layout Section */}
        {selectedBus && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-black dark:ring-slate-800">
            <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
              Bus Seat Layout
            </h3>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {selectedBus.number} ({selectedBus.type})
              </p>
              {selectedBus.capacity && (
                <p className="mt-1">Capacity: {selectedBus.capacity} seats</p>
              )}
            </div>
            <SeatEditor
              key={`seat-editor-${selectedBus._id}-${
                formSeats.length || selectedBus.seats?.length || 0
              }`}
              value={
                Array.isArray(formSeats) && formSeats.length > 0
                  ? formSeats
                  : Array.isArray(selectedBus.seats) &&
                    selectedBus.seats.length > 0
                  ? selectedBus.seats
                  : []
              }
              rows={Number(selectedBus.rows) || 10}
              columns={Number(selectedBus.columns) || 5}
              aisleColumns={
                Array.isArray(selectedBus.aisleColumns)
                  ? selectedBus.aisleColumns
                  : []
              }
              readOnly={false}
              allowRowRemoval={false}
              onChange={(seats) => {
                // Update form with new seats
                form.setFieldValue("seats", seats);
                // Also update selectedBus state to keep it in sync
                setSelectedBus((prev: any) => ({
                  ...prev,
                  seats: seats,
                }));
              }}
              onRowsChange={(rows) => {
                form.setFieldValue("rows", rows);
                setSelectedBus((prev: any) => ({
                  ...prev,
                  rows: rows,
                }));
              }}
              onColumnsChange={(columns) => {
                form.setFieldValue("columns", columns);
                setSelectedBus((prev: any) => ({
                  ...prev,
                  columns: columns,
                }));
              }}
              onAisleColumnsChange={(aisleColumns) => {
                form.setFieldValue("aisleColumns", aisleColumns);
                setSelectedBus((prev: any) => ({
                  ...prev,
                  aisleColumns: aisleColumns,
                }));
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewSchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewScheduleForm />
    </Suspense>
  );
}
