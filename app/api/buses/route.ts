import connectToDatabase from "@/lib/db";
import { Bus } from "@/lib/models/bus";
import { SeatPlan } from "@/lib/models/seat-plan";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const buses = await Bus.find({})
      .populate("company", "name")
      .populate({
        path: "seatPlan",
        select: "name type",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 });
    return NextResponse.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    return NextResponse.json(
      { message: "Failed to fetch buses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    console.log("Creating bus with body:", JSON.stringify(body, null, 2));

    // Prepare the bus data to save
    const busData: any = { ...body };

    // If seatPlan is provided, use seats from payload or fetch from seat plan
    if (body.seatPlan) {
      // Use seats from payload if provided, otherwise fetch from seat plan
      let seats = Array.isArray(body.seats) ? body.seats : [];

      if (seats.length === 0) {
        // If no seats in payload, fetch from seat plan
        const seatPlan = await SeatPlan.findById(body.seatPlan);
        if (seatPlan) {
          seats = Array.isArray(seatPlan.seats) ? seatPlan.seats : [];
          busData.seatPlanLayout = {
            rows: seatPlan.rows || 0,
            columns: seatPlan.columns || 0,
            aisleColumns: Array.isArray(seatPlan.aisleColumns)
              ? seatPlan.aisleColumns
              : [],
            seats: seats,
          };
        }
      } else {
        // Use seats from payload, fetch other details from seat plan
        const seatPlan = await SeatPlan.findById(body.seatPlan);
        if (seatPlan) {
          busData.seatPlanLayout = {
            rows: seatPlan.rows || 0,
            columns: seatPlan.columns || 0,
            aisleColumns: Array.isArray(seatPlan.aisleColumns)
              ? seatPlan.aisleColumns
              : [],
            seats: seats,
          };
        }
      }

      // Save seatPlan reference
      busData.seatPlan = body.seatPlan;

      // Also save seats directly to bus model if provided
      if (Array.isArray(body.seats) && body.seats.length > 0) {
        busData.seats = body.seats;
      } else if (Array.isArray(seatPlan.seats) && seatPlan.seats.length > 0) {
        busData.seats = seatPlan.seats;
      }
    }

    // Ensure seats is an array if provided
    if (body.seats !== undefined) {
      busData.seats = Array.isArray(body.seats) ? body.seats : [];
    }

    // Ensure capacity is set
    if (!busData.capacity) {
      return NextResponse.json(
        { message: "Capacity is required" },
        { status: 400 }
      );
    }

    console.log("Saving bus data:", JSON.stringify(busData, null, 2));

    // Bus.create() automatically saves the document to the database
    // It includes all fields: seatPlan, seatPlanLayout, seats, etc.
    const newBusResult = await Bus.create(busData);

    // TypeScript fix: Bus.create can return array or single doc, but we pass single object
    const newBus = Array.isArray(newBusResult) ? newBusResult[0] : newBusResult;

    // Verify what was saved
    console.log("Bus created successfully. seatPlan:", newBus.seatPlan);
    console.log(
      "Bus created successfully. seatPlanLayout exists:",
      !!newBus.seatPlanLayout
    );

    await newBus.populate("company", "name");

    // Only populate seatPlan if it exists
    if (newBus.seatPlan) {
      await newBus.populate({
        path: "seatPlan",
        select: "name type",
        strictPopulate: false,
      });
    }

    return NextResponse.json(newBus, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bus:", error);

    // Return more detailed error message
    let errorMessage = "Failed to create bus";
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors || {}).map(
        (err: any) => err.message
      );
      errorMessage = validationErrors.join(", ");
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: errorMessage, error: error.name, details: error.errors },
      { status: 400 }
    );
  }
}
