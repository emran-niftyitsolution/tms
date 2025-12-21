import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Fare } from "@/lib/models/fare";

export async function GET() {
  try {
    await connectToDatabase();
    const fares = await Fare.find({})
      .populate("company", "name")
      .populate("seatClass", "name fare")
      .populate({
        path: "route",
        select: "name from to",
        populate: [
          { path: "from", select: "name code" },
          { path: "to", select: "name code" },
        ],
      })
      .sort({ createdAt: -1 });
    return NextResponse.json(fares);
  } catch (error) {
    console.error("Error fetching fares:", error);
    return NextResponse.json(
      { message: "Failed to fetch fares" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newFare = await Fare.create(body);
    const populatedFare = await Fare.findById(newFare._id)
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
    return NextResponse.json(populatedFare, { status: 201 });
  } catch (error: any) {
    console.error("Error creating fare:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create fare" },
      { status: 500 }
    );
  }
}





