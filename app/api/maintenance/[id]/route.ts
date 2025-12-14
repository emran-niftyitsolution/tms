import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Maintenance } from "@/lib/models/maintenance";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const maintenance = await Maintenance.findById(params.id).populate("bus", "number");

    if (!maintenance) {
      return NextResponse.json(
        { message: "Maintenance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("Error fetching maintenance:", error);
    return NextResponse.json(
      { message: "Failed to fetch maintenance" },
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

    const updated = await Maintenance.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Maintenance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating maintenance:", error);
    return NextResponse.json(
      { message: "Failed to update maintenance" },
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
    const deleted = await Maintenance.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Maintenance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Maintenance deleted successfully" });
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    return NextResponse.json(
      { message: "Failed to delete maintenance" },
      { status: 500 }
    );
  }
}


