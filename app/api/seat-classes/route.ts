import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SeatClass } from "@/lib/models/seat-class";

export async function GET() {
  try {
    await connectToDatabase();
    const seatClasses = await SeatClass.find({})
      .populate("company", "name")
      .sort({ name: 1 });
    return NextResponse.json(seatClasses);
  } catch (error) {
    console.error("Error fetching seat classes:", error);
    return NextResponse.json(
      { message: "Failed to fetch seat classes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { message: "Seat class name is required" },
        { status: 400 }
      );
    }

    if (!body.company) {
      return NextResponse.json(
        { message: "Company is required" },
        { status: 400 }
      );
    }

    const newSeatClass = await SeatClass.create(body);
    const populatedSeatClass = await SeatClass.findById(newSeatClass._id)
      .populate("company", "name");
    return NextResponse.json(populatedSeatClass, { status: 201 });
  } catch (error: any) {
    console.error("Error creating seat class:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Seat class with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create seat class" },
      { status: 500 }
    );
  }
}


