import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Maintenance } from "@/lib/models/maintenance";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const busId = searchParams.get("busId");
    
    const query = busId ? { bus: busId } : {};
    const maintenance = await Maintenance.find(query)
      .populate("bus", "number")
      .sort({ serviceDate: -1 });
    return NextResponse.json(maintenance);
  } catch (error) {
    console.error("Error fetching maintenance:", error);
    return NextResponse.json(
      { message: "Failed to fetch maintenance" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newMaintenance = await Maintenance.create(body);
    return NextResponse.json(newMaintenance, { status: 201 });
  } catch (error) {
    console.error("Error creating maintenance:", error);
    return NextResponse.json(
      { message: "Failed to create maintenance" },
      { status: 500 }
    );
  }
}


