import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SeatClass } from "@/lib/models/seat-class";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const seatClass = await SeatClass.findById(params.id)
      .populate("company", "name");

    if (!seatClass) {
      return NextResponse.json(
        { message: "Seat class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(seatClass);
  } catch (error) {
    console.error("Error fetching seat class:", error);
    return NextResponse.json(
      { message: "Failed to fetch seat class" },
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

    const updatedSeatClass = await SeatClass.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate("company", "name");

    if (!updatedSeatClass) {
      return NextResponse.json(
        { message: "Seat class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSeatClass);
  } catch (error: any) {
    console.error("Error updating seat class:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Seat class with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update seat class" },
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
    const deletedSeatClass = await SeatClass.findByIdAndDelete(params.id);

    if (!deletedSeatClass) {
      return NextResponse.json(
        { message: "Seat class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Seat class deleted successfully" });
  } catch (error) {
    console.error("Error deleting seat class:", error);
    return NextResponse.json(
      { message: "Failed to delete seat class" },
      { status: 500 }
    );
  }
}


