import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Stoppage } from "@/lib/models/stoppage";

export async function GET() {
  try {
    await connectToDatabase();
    const stoppages = await Stoppage.find({})
      .populate("company", "name")
      .populate("city", "name company status")
      .populate({
        path: "city",
        populate: { path: "company", select: "name" }
      })
      .sort({ name: 1 });
    return NextResponse.json(stoppages);
  } catch (error) {
    console.error("Error fetching stoppages:", error);
    return NextResponse.json(
      { message: "Failed to fetch stoppages" },
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
        { message: "Stoppage name is required" },
        { status: 400 }
      );
    }

    if (!body.company) {
      return NextResponse.json(
        { message: "Company is required" },
        { status: 400 }
      );
    }

    if (!body.city) {
      return NextResponse.json(
        { message: "City is required" },
        { status: 400 }
      );
    }

    const newStoppage = await Stoppage.create(body);
    const populatedStoppage = await Stoppage.findById(newStoppage._id)
      .populate("company", "name")
      .populate("city", "name company status")
      .populate({
        path: "city",
        populate: { path: "company", select: "name" }
      });
    return NextResponse.json(populatedStoppage, { status: 201 });
  } catch (error: any) {
    console.error("Error creating stoppage:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Stoppage with this code already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create stoppage" },
      { status: 500 }
    );
  }
}

