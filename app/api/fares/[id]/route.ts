import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Fare } from "@/lib/models/fare";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const fare = await Fare.findById(params.id)
      .populate("company", "name")
      .populate("seatClass", "name fare")
      .populate({
        path: "route",
        select: "name from to",
        populate: [
          { path: "from", select: "name code" },
          { path: "to", select: "name code" },
        ],
      });

    if (!fare) {
      return NextResponse.json(
        { message: "Fare not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(fare);
  } catch (error) {
    console.error("Error fetching fare:", error);
    return NextResponse.json(
      { message: "Failed to fetch fare" },
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

    const updatedFare = await Fare.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate("company", "name")
      .populate("seatClass", "name fare")
      .populate({
        path: "route",
        select: "name from to",
        populate: [
          { path: "from", select: "name code" },
          { path: "to", select: "name code" },
        ],
      });

    if (!updatedFare) {
      return NextResponse.json(
        { message: "Fare not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFare);
  } catch (error: any) {
    console.error("Error updating fare:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update fare" },
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
    const deletedFare = await Fare.findByIdAndDelete(params.id);

    if (!deletedFare) {
      return NextResponse.json(
        { message: "Fare not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Fare deleted successfully" });
  } catch (error) {
    console.error("Error deleting fare:", error);
    return NextResponse.json(
      { message: "Failed to delete fare" },
      { status: 500 }
    );
  }
}





