import connectToDatabase from "@/lib/db";
import { Bus } from "@/lib/models/bus";
import { SeatPlan } from "@/lib/models/seat-plan";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const bus = await Bus.findById(params.id).populate("company", "name");

    if (!bus) {
      return NextResponse.json({ message: "Bus not found" }, { status: 404 });
    }

    // Always try to populate seatPlan (even if null/undefined)
    try {
      await bus.populate({
        path: "seatPlan",
        select: "name type rows columns aisleColumns seats",
        strictPopulate: false,
      });
    } catch (populateError) {
      console.error("Error populating seatPlan:", populateError);
      // Continue even if populate fails - seatPlan will be null/undefined
    }

    // Convert to plain object to ensure all fields are included
    const busData = bus.toObject ? bus.toObject() : bus;

    // Ensure seatPlan field is always present (even if null)
    if (!busData.hasOwnProperty("seatPlan")) {
      busData.seatPlan = null;
    }

    // Extract seats from seatPlanLayout if seats field doesn't exist or is empty
    if (
      !busData.hasOwnProperty("seats") ||
      !Array.isArray(busData.seats) ||
      busData.seats.length === 0
    ) {
      busData.seats = busData.seatPlanLayout?.seats || [];
    }

    // Ensure rows, columns, aisleColumns are present (extract from seatPlanLayout if needed)
    if (!busData.hasOwnProperty("rows") || !busData.rows) {
      busData.rows = busData.seatPlanLayout?.rows || null;
    }
    if (!busData.hasOwnProperty("columns") || !busData.columns) {
      busData.columns = busData.seatPlanLayout?.columns || null;
    }
    if (
      !busData.hasOwnProperty("aisleColumns") ||
      !Array.isArray(busData.aisleColumns) ||
      busData.aisleColumns.length === 0
    ) {
      busData.aisleColumns = busData.seatPlanLayout?.aisleColumns || [];
    }

    console.log(
      "GET bus response - seats:",
      busData.seats?.length || 0,
      "rows:",
      busData.rows,
      "columns:",
      busData.columns
    );

    return NextResponse.json(busData);
  } catch (error) {
    console.error("Error fetching bus:", error);
    return NextResponse.json(
      { message: "Failed to fetch bus" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const body = await req.json();

    // Prepare update data - seatPlan updates like company (directly from body)
    const updateData: any = { ...body };

    // If seatPlan is provided, fetch and save its layout (similar to how we handle other related data)
    if (body.seatPlan) {
      const seatPlan = await SeatPlan.findById(body.seatPlan);
      if (seatPlan) {
        // Use seats from payload if provided, otherwise use seats from seat plan
        const seats =
          Array.isArray(body.seats) && body.seats.length > 0
            ? body.seats
            : Array.isArray(seatPlan.seats)
            ? seatPlan.seats
            : [];

        // Use aisleColumns from body if provided, otherwise from seat plan
        const aisleColumns = Array.isArray(body.aisleColumns) && body.aisleColumns.length > 0
          ? body.aisleColumns.filter((ac: any) => typeof ac === 'number').sort((a: number, b: number) => a - b)
          : Array.isArray(seatPlan.aisleColumns)
          ? seatPlan.aisleColumns
          : [];

        updateData.seatPlanLayout = {
          rows: body.rows || seatPlan.rows || 0,
          columns: body.columns || seatPlan.columns || 0,
          aisleColumns: aisleColumns,
          seats: seats,
        };

        // Also save seats directly to bus model if provided
        if (Array.isArray(body.seats) && body.seats.length > 0) {
          updateData.seats = body.seats;
        } else if (Array.isArray(seatPlan.seats) && seatPlan.seats.length > 0) {
          updateData.seats = seatPlan.seats;
        }
      }
    } else if (body.seatPlan === null || body.seatPlan === "") {
      // Clear seatPlan if explicitly set to null/empty
      updateData.seatPlan = null;
      updateData.seatPlanLayout = null;
      updateData.seats = [];
    } else {
      // If no seatPlan but seats/rows/columns/aisleColumns are provided, update seatPlanLayout
      if (body.seats !== undefined || body.rows !== undefined || body.columns !== undefined || body.aisleColumns !== undefined) {
        updateData.seatPlanLayout = {
          rows: body.rows || updateData.seatPlanLayout?.rows || 0,
          columns: body.columns || updateData.seatPlanLayout?.columns || 0,
          aisleColumns: Array.isArray(body.aisleColumns)
            ? body.aisleColumns.filter((ac: any) => typeof ac === 'number').sort((a: number, b: number) => a - b)
            : updateData.seatPlanLayout?.aisleColumns || [],
          seats: Array.isArray(body.seats) ? body.seats : updateData.seatPlanLayout?.seats || [],
        };
      }
    }

    // Ensure seats is an array if provided
    if (body.seats !== undefined) {
      updateData.seats = Array.isArray(body.seats) ? body.seats : [];
    }

    // Ensure rows, columns, and aisleColumns are saved if provided
    if (body.rows !== undefined) {
      updateData.rows = Number(body.rows) || 0;
    }
    if (body.columns !== undefined) {
      updateData.columns = Number(body.columns) || 0;
    }
    if (body.aisleColumns !== undefined) {
      updateData.aisleColumns = Array.isArray(body.aisleColumns)
        ? body.aisleColumns.filter((ac: any) => typeof ac === 'number').sort((a: number, b: number) => a - b)
        : [];
    }

    // Remove old fields
    delete updateData.seatLayout;
    delete updateData.totalRows;

    // Remove old fields
    delete updateData.seatLayout;
    delete updateData.totalRows;

    // Update the bus - seatPlan updates like company (directly from body)
    // Bus.findByIdAndUpdate automatically saves to database
    console.log("🚀 ~ PUT ~ updateData:", updateData);
    const updatedBus = await Bus.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBus) {
      return NextResponse.json({ message: "Bus not found" }, { status: 404 });
    }

    await updatedBus.populate("company", "name");

    // Always try to populate seatPlan (even if null)
    try {
      await updatedBus.populate({
        path: "seatPlan",
        select: "name type rows columns aisleColumns seats",
        strictPopulate: false,
      });
    } catch (populateError) {
      console.error("Error populating seatPlan:", populateError);
    }

    // Convert to plain object and ensure seatPlan is included
    const busData = updatedBus.toObject ? updatedBus.toObject() : updatedBus;

    // Ensure seatPlan field is always present in response
    if (!busData.hasOwnProperty("seatPlan")) {
      busData.seatPlan = null;
    }

    return NextResponse.json(busData);
  } catch (error) {
    console.error("Error updating bus:", error);
    return NextResponse.json(
      { message: "Failed to update bus" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const deletedBus = await Bus.findByIdAndDelete(params.id);

    if (!deletedBus) {
      return NextResponse.json({ message: "Bus not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    return NextResponse.json(
      { message: "Failed to delete bus" },
      { status: 500 }
    );
  }
}
