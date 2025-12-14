import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Staff } from "@/lib/models/staff";

export async function GET() {
  try {
    await connectToDatabase();
    const staff = await Staff.find({}).populate("company", "name").sort({ name: 1 });
    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { message: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newStaff = await Staff.create(body);
    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      { message: "Failed to create staff" },
      { status: 500 }
    );
  }
}


