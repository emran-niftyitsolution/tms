import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SeatPlan } from "@/lib/models/seat-plan";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const seatPlan = await SeatPlan.findById(params.id)
      .populate("company", "name");

    if (!seatPlan) {
      return NextResponse.json(
        { message: "Seat plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(seatPlan);
  } catch (error) {
    console.error("Error fetching seat plan:", error);
    return NextResponse.json(
      { message: "Failed to fetch seat plan" },
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

    const updatedSeatPlan = await SeatPlan.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate("company", "name");

    if (!updatedSeatPlan) {
      return NextResponse.json(
        { message: "Seat plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSeatPlan);
  } catch (error: any) {
    console.error("Error updating seat plan:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update seat plan" },
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
    const deletedSeatPlan = await SeatPlan.findByIdAndDelete(params.id);

    if (!deletedSeatPlan) {
      return NextResponse.json(
        { message: "Seat plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Seat plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting seat plan:", error);
    return NextResponse.json(
      { message: "Failed to delete seat plan" },
      { status: 500 }
    );
  }
}


