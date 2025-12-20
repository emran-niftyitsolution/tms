"use client";

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SeatEditor } from "../seat-plans/components/SeatEditor";

type Schedule = {
  _id: string;
  number?: string;
  company: { _id: string; name: string } | null;
  bus: {
    _id: string;
    number: string;
    type: string;
    rows?: number;
    columns?: number;
    aisleColumns?: number[];
    seats?: any[];
  } | null;
  route: {
    _id: string;
    name: string;
    from: { _id: string; name: string } | string;
    to: { _id: string; name: string } | string;
    stoppages?: Array<{
      place: { _id: string; name: string } | string;
      boarding: boolean;
      dropping: boolean;
      boardingTime?: string;
      droppingTime?: string;
    }>;
  } | null;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: "Scheduled" | "Delayed" | "Completed" | "Cancelled";
  seats?: any[];
};

export default function TicketsPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<{
    [scheduleId: string]: { row: number; column: number; seatNumber: number; seatName?: string; fare: number }[];
  }>({});
  const [passengerForms, setPassengerForms] = useState<{
    [scheduleId: string]: any;
  }>({});
  const [bookedSeats, setBookedSeats] = useState<{
    [scheduleId: string]: { row: number; column: number }[];
  }>({});
  const [expandedScheduleDetails, setExpandedScheduleDetails] = useState<{
    [scheduleId: string]: Schedule;
  }>({});

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedules");
      if (res.ok) {
        const data = await res.json();
        const scheduleList = Array.isArray(data) ? data : [];
        setSchedules(scheduleList);
        setFilteredSchedules(scheduleList);
      }
    } catch {
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchCompanies();
  }, []);

  // Fetch booked seats for each schedule
  useEffect(() => {
    const fetchBookedSeats = async () => {
      const bookedSeatsMap: { [scheduleId: string]: { row: number; column: number }[] } = {};
      
      for (const schedule of filteredSchedules) {
        try {
          const res = await fetch(`/api/tickets?scheduleId=${schedule._id}`);
          if (res.ok) {
            const tickets = await res.json();
            if (Array.isArray(tickets)) {
              bookedSeatsMap[schedule._id] = tickets.map((t: any) => ({
                row: t.seat.row,
                column: t.seat.column,
              }));
            }
          }
        } catch {
          // Silently fail
        }
      }
      
      setBookedSeats(bookedSeatsMap);
    };

    if (filteredSchedules.length > 0) {
      fetchBookedSeats();
    }
  }, [filteredSchedules]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(
          Array.isArray(data)
            ? data.map((c: any) => ({ label: c.name, value: c._id }))
            : []
        );
      }
    } catch {
      // Silently fail
    }
  };

  useEffect(() => {
    let result = schedules;

    if (dateFilter) {
      result = result.filter((s) =>
        dayjs(s.departureTime).isSame(dateFilter, "day")
      );
    }

    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (companyFilter) {
      result = result.filter(
        (s) =>
          s.company &&
          (typeof s.company === "object"
            ? s.company._id === companyFilter
            : s.company === companyFilter)
      );
    }

    setFilteredSchedules(result);
  }, [schedules, dateFilter, statusFilter, companyFilter]);

  const handleSeatSelect = (
    scheduleId: string,
    seat: { row: number; column: number; seatNumber: number; seatName?: string; fare: number } | null
  ) => {
    setSelectedSeats((prev) => {
      const currentSeats = Array.isArray(prev[scheduleId]) ? prev[scheduleId] : [];
      
      if (!seat) {
        // Deselect all if null
        return { ...prev, [scheduleId]: [] };
      }
      
      // Check if seat is already selected
      const isSelected = currentSeats.some(
        (s) => s.row === seat.row && s.column === seat.column
      );
      
      if (isSelected) {
        // Remove seat
        return {
          ...prev,
          [scheduleId]: currentSeats.filter(
            (s) => !(s.row === seat.row && s.column === seat.column)
          ),
        };
      } else {
        // Add seat
        return {
          ...prev,
          [scheduleId]: [...currentSeats, seat],
        };
      }
    });
  };

  const handleCreateTicket = async (schedule: Schedule) => {
    const selectedSeatsList = selectedSeats[schedule._id] || [];
    const passengerData = passengerForms[schedule._id] || {};
    const fullSchedule = expandedScheduleDetails[schedule._id] || schedule;

    if (selectedSeatsList.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    if (!passengerData.name || !passengerData.phone) {
      toast.error("Please fill in passenger information");
      return;
    }

    // Calculate totals - ensure selectedSeatsList is an array before using reduce
    const totalFare = Array.isArray(selectedSeatsList) && selectedSeatsList.length > 0
      ? selectedSeatsList.reduce((sum, seat) => sum + (seat.fare || 0), 0)
      : 0;
    const discount = passengerData.discount || 0;
    const discountAmount = (totalFare * discount) / 100;
    const finalAmount = totalFare - discountAmount;

    try {
      // Generate ticket number
      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const ticketData = {
        schedule: schedule._id,
        passengerName: passengerData.name,
        passengerPhone: passengerData.phone,
        passengerEmail: passengerData.email || "",
        passengerNID: passengerData.nid || "",
        seats: selectedSeatsList.map((seat) => ({
          row: seat.row,
          column: seat.column,
          seatNumber: seat.seatNumber,
          seatName: seat.seatName,
          fare: seat.fare,
        })),
        totalFare,
        discount,
        discountAmount,
        finalAmount,
        boardingPoint: passengerData.boardingPoint || null,
        droppingPoint: passengerData.droppingPoint || null,
        ticketNumber,
        status: "Confirmed",
      };

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create ticket");
      }

      const ticket = await res.json();
      toast.success("Ticket created successfully");

      // Generate and download PDF
      await generateAndDownloadPDF(ticket, fullSchedule);

      // Reset form
      setSelectedSeats((prev) => ({
        ...prev,
        [schedule._id]: [],
      }));
      setPassengerForms((prev) => ({
        ...prev,
        [schedule._id]: {},
      }));

      // Refresh schedules to update seat availability
      fetchSchedules();
    } catch (error: any) {
      toast.error(error.message || "Failed to create ticket");
    }
  };

  const generateAndDownloadPDF = async (ticket: any, schedule: Schedule) => {
    try {
      const res = await fetch("/api/tickets/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticket, schedule }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const data = await res.json();
      
      // Create a new window with the HTML content for printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(data.html);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print (which allows saving as PDF)
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            // Close window after print dialog is shown
            // User can save as PDF from the print dialog
          }, 500);
        };
      } else {
        toast.error("Please allow popups to download the ticket");
      }
    } catch (error: any) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const columns = [
    {
      title: "Departure",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (text: string) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">
            {dayjs(text).format("MMM D, YYYY")}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {dayjs(text).format("h:mm A")}
          </span>
        </div>
      ),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: Schedule["company"]) => company?.name || "-",
    },
    {
      title: "Bus",
      dataIndex: "bus",
      key: "bus",
      render: (bus: Schedule["bus"]) =>
        bus ? (
          <div className="flex flex-col">
            <span className="font-medium">{bus.number}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {bus.type}
            </span>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
      render: (route: Schedule["route"]) =>
        route ? (
          <div className="flex flex-col">
            <span className="font-medium">{route.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {typeof route.from === "object" ? route.from.name : route.from} -{" "}
              {typeof route.to === "object" ? route.to.name : route.to}
            </span>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="font-medium">৳{price}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Schedule["status"]) => {
        let color = "default";
        if (status === "Scheduled") color = "blue";
        if (status === "Delayed") color = "warning";
        if (status === "Completed") color = "success";
        if (status === "Cancelled") color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const renderExpandedRow = (schedule: Schedule) => {
    // Ensure selectedSeatsList is always an array
    const selectedSeatsList = Array.isArray(selectedSeats[schedule._id]) 
      ? selectedSeats[schedule._id] 
      : [];
    const passengerData = passengerForms[schedule._id] || {};

    // Use expanded schedule details if available, otherwise use the schedule from the list
    const fullSchedule = expandedScheduleDetails[schedule._id] || schedule;

    // Get bus seat layout - prioritize schedule seats, then bus seats
    const busSeats = fullSchedule.seats && fullSchedule.seats.length > 0
      ? fullSchedule.seats
      : fullSchedule.bus?.seats || [];
    const busRows = fullSchedule.bus?.rows || 10;
    const busColumns = fullSchedule.bus?.columns || 5;
    const busAisleColumns = fullSchedule.bus?.aisleColumns || [];

    // Get route stoppages for boarding/dropping points
    const routeStoppages = fullSchedule.route?.stoppages || [];
    const boardingPoints = routeStoppages
      .filter((s: any) => s.boarding)
      .map((s: any) => ({
        label: typeof s.place === "object" ? s.place.name : s.place,
        value: typeof s.place === "object" ? s.place._id : s.place,
      }));
    const droppingPoints = routeStoppages
      .filter((s: any) => s.dropping)
      .map((s: any) => ({
        label: typeof s.place === "object" ? s.place.name : s.place,
        value: typeof s.place === "object" ? s.place._id : s.place,
      }));

    // Calculate totals - ensure selectedSeatsList is an array before using reduce
    const totalFare = Array.isArray(selectedSeatsList) && selectedSeatsList.length > 0
      ? selectedSeatsList.reduce((sum, seat) => sum + (seat.fare || 0), 0)
      : 0;
    const discount = passengerData.discount || 0;
    const discountAmount = (totalFare * discount) / 100;
    const finalAmount = totalFare - discountAmount;

    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Seat Plan */}
          <div className="rounded-lg bg-white dark:bg-slate-800 p-4">
            <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
              Select Seat
            </h4>
            <SeatEditor
              value={busSeats}
              rows={busRows}
              columns={busColumns}
              aisleColumns={busAisleColumns}
              readOnly={true}
              allowRowRemoval={false}
              selectionMode={true}
              selectedSeat={selectedSeatsList.length > 0 ? selectedSeatsList.map(s => ({ row: s.row, column: s.column })) : null}
              onSeatSelect={(seat) => {
                const fullSchedule = expandedScheduleDetails[schedule._id] || schedule;
                const currentSeats = Array.isArray(selectedSeats[schedule._id]) 
                  ? selectedSeats[schedule._id] 
                  : [];
                
                if (seat) {
                  // Check if this seat is already selected
                  const isAlreadySelected = currentSeats.some(
                    (s) => s.row === seat.row && s.column === seat.column
                  );
                  
                  if (isAlreadySelected) {
                    // Remove the seat
                    handleSeatSelect(schedule._id, {
                      row: seat.row,
                      column: seat.column,
                      seatNumber: seat.seatNumber,
                      seatName: seat.seatName,
                      fare: 0, // Will be ignored in toggle logic
                    });
                  } else {
                    // Add the seat
                    const scheduleSeat = fullSchedule.seats?.find(
                      (s: any) => s.row === seat.row && s.column === seat.column
                    );
                    handleSeatSelect(schedule._id, {
                      row: seat.row,
                      column: seat.column,
                      seatNumber: seat.seatNumber,
                      seatName: seat.seatName,
                      fare: scheduleSeat?.fare || fullSchedule.price || 0,
                    });
                  }
                } else {
                  // Handle null case - clear all selections
                  handleSeatSelect(schedule._id, null);
                }
              }}
              bookedSeats={bookedSeats[schedule._id] || []}
              onChange={() => {}}
              onRowsChange={() => {}}
              onColumnsChange={() => {}}
              onAisleColumnsChange={() => {}}
            />
          </div>

          {/* Right Side - Passenger Information */}
          <div className="rounded-lg bg-white dark:bg-slate-800 p-4">
            <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
              Passenger Information
            </h4>
            <Form
              layout="vertical"
              initialValues={passengerData}
              onValuesChange={(_, allValues) => {
                setPassengerForms((prev) => ({
                  ...prev,
                  [schedule._id]: allValues,
                }));
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="name"
                  label="Passenger Name"
                  rules={[{ required: true, message: "Name is required" }]}
                >
                  <Input size="large" placeholder="Enter passenger name" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: "Phone is required" },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Please enter a valid phone number",
                    },
                  ]}
                >
                  <Input size="large" placeholder="01XXXXXXXXX" />
                </Form.Item>

                <Form.Item name="email" label="Email (Optional)">
                  <Input
                    size="large"
                    type="email"
                    placeholder="email@example.com"
                  />
                </Form.Item>

                <Form.Item name="nid" label="NID (Optional)">
                  <Input size="large" placeholder="National ID" />
                </Form.Item>
              </div>

              {(boardingPoints.length > 0 || droppingPoints.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {boardingPoints.length > 0 && (
                    <Form.Item
                      name="boardingPoint"
                      label="Boarding Point"
                      rules={[{ required: true, message: "Boarding point is required" }]}
                    >
                      <Select
                        size="large"
                        placeholder="Select boarding point"
                        options={boardingPoints}
                      />
                    </Form.Item>
                  )}

                  {droppingPoints.length > 0 && (
                    <Form.Item
                      name="droppingPoint"
                      label="Dropping Point"
                      rules={[{ required: true, message: "Dropping point is required" }]}
                    >
                      <Select
                        size="large"
                        placeholder="Select dropping point"
                        options={droppingPoints}
                      />
                    </Form.Item>
                  )}
                </div>
              )}

              {selectedSeatsList.length > 0 && (
                <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Selected Seats ({selectedSeatsList.length}):
                  </p>
                  <div className="space-y-1 mb-3">
                    {selectedSeatsList.map((seat, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {seat.seatName || `Seat ${seat.seatNumber}`}
                        </span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          ৳{seat.fare}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        ৳{totalFare}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Form.Item
                name="discount"
                label="Discount (%)"
                rules={[
                  { type: "number", min: 0, max: 100, message: "Discount must be between 0 and 100" },
                ]}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <InputNumber
                    size="large"
                    placeholder="0"
                    min={0}
                    max={100}
                    style={{ width: "100%" }}
                  />
                  <Button size="large" style={{ pointerEvents: "none" }}>%</Button>
                </Space.Compact>
              </Form.Item>

              {selectedSeatsList.length > 0 && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex justify-between text-base mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Total Fare:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ৳{totalFare}
                    </span>
                  </div>
                  {discount > 0 && (
                    <>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Discount ({discount}%):</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          -৳{discountAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-base pt-2 border-t border-green-200 dark:border-green-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Final Amount:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ৳{finalAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              <Button
                type="primary"
                size="large"
                block
                onClick={() => handleCreateTicket(schedule)}
                disabled={selectedSeatsList.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Create Ticket
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Tickets
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Book tickets for trips
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <DatePicker
          placeholder="Filter by Date"
          className="rounded-lg"
          style={{ width: 200 }}
          onChange={(date) => setDateFilter(date)}
        />
        <Select
          placeholder="Filter by Status"
          allowClear
          className="rounded-lg"
          style={{ width: 150 }}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { label: "Scheduled", value: "Scheduled" },
            { label: "Delayed", value: "Delayed" },
            { label: "Completed", value: "Completed" },
            { label: "Cancelled", value: "Cancelled" },
          ]}
        />
        <Select
          placeholder="Filter by Company"
          allowClear
          className="rounded-lg"
          style={{ width: 200 }}
          showSearch
          optionFilterProp="label"
          onChange={(value) => setCompanyFilter(value)}
          options={companies}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredSchedules}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => renderExpandedRow(record),
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
        }}
      />
    </div>
  );
}

