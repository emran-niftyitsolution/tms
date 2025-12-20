import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SeatPlan } from "@/lib/models/seat-plan";

export async function GET() {
  try {
    await connectToDatabase();
    const seatPlans = await SeatPlan.find({})
      .populate("company", "name")
      .sort({ name: 1 });
    return NextResponse.json(seatPlans);
  } catch (error) {
    console.error("Error fetching seat plans:", error);
    return NextResponse.json(
      { message: "Failed to fetch seat plans" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Ensure seats array is properly formatted (even if empty)
    if (body.seats === undefined) {
      body.seats = [];
    } else if (Array.isArray(body.seats)) {
      body.seats = body.seats.map((seat: any) => ({
        row: seat.row,
        column: seat.column,
        seatNumber: seat.seatNumber,
        seatName: seat.seatName || undefined,
        isBroken: seat.isBroken || false,
        isAisle: seat.isAisle || false,
      }));
    } else {
      body.seats = [];
    }

    // Ensure aisleColumns is properly formatted (array of numbers)
    if (body.aisleColumns === undefined) {
      body.aisleColumns = [];
    } else if (Array.isArray(body.aisleColumns)) {
      body.aisleColumns = body.aisleColumns.filter((ac: any) => typeof ac === 'number').sort((a: number, b: number) => a - b);
    } else {
      body.aisleColumns = [];
    }
    
    const newSeatPlan = await SeatPlan.create(body);
    const populatedSeatPlan = await SeatPlan.findById(newSeatPlan._id)
      .populate("company", "name");
    return NextResponse.json(populatedSeatPlan, { status: 201 });
  } catch (error: any) {
    console.error("Error creating seat plan:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create seat plan" },
      { status: 500 }
    );
  }
}


