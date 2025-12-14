import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { BusAssignment } from "@/lib/models/bus-assignment";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const busId = searchParams.get("busId");
    
    const query = busId ? { bus: busId } : {};
    const assignments = await BusAssignment.find(query)
      .populate("bus", "number")
      .populate("driver", "name role")
      .populate("helper", "name role")
      .populate("route", "name")
      .sort({ startDate: -1 });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { message: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newAssignment = await BusAssignment.create(body);
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { message: "Failed to create assignment" },
      { status: 500 }
    );
  }
}


