import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Staff } from "@/lib/models/staff";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const staff = await Staff.findById(params.id).populate("company", "name");

    if (!staff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { message: "Failed to fetch staff" },
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

    const updatedStaff = await Staff.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate("company", "name");

    if (!updatedStaff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStaff);
  } catch (error: any) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update staff" },
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
    const deletedStaff = await Staff.findByIdAndDelete(params.id);

    if (!deletedStaff) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { message: "Failed to delete staff" },
      { status: 500 }
    );
  }
}

