import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Schedule } from "@/lib/models/schedule";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const schedule = await Schedule.findById(params.id)
      .populate("company", "name")
      .populate("bus", "number type")
      .populate({
        path: "route",
        select: "name from to",
        populate: [
          { path: "from", select: "name code" },
          { path: "to", select: "name code" },
        ],
      });

    if (!schedule) {
      return NextResponse.json(
        { message: "Schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { message: "Failed to fetch schedule" },
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

    const updatedSchedule = await Schedule.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate("company", "name")
      .populate("bus", "number type")
      .populate({
        path: "route",
        select: "name from to",
        populate: [
          { path: "from", select: "name code" },
          { path: "to", select: "name code" },
        ],
      });

    if (!updatedSchedule) {
      return NextResponse.json(
        { message: "Schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { message: "Failed to update schedule" },
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
    const deletedSchedule = await Schedule.findByIdAndDelete(params.id);

    if (!deletedSchedule) {
      return NextResponse.json(
        { message: "Schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { message: "Failed to delete schedule" },
      { status: 500 }
    );
  }
}


