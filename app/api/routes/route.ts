import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Route } from "@/lib/models/route";

export async function GET() {
  try {
    await connectToDatabase();
    const routes = await Route.find({})
      .populate("company", "name")
      .populate("from", "name code city")
      .populate("to", "name code city")
      .populate("stoppages.place", "name code city")
      .sort({ createdAt: -1 });
    return NextResponse.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      { message: "Failed to fetch routes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newRoute = await Route.create(body);
    const populatedRoute = await Route.findById(newRoute._id)
      .populate("company", "name")
      .populate("from", "name code city")
      .populate("to", "name code city")
      .populate("stoppages.place", "name code city");
    return NextResponse.json(populatedRoute, { status: 201 });
  } catch (error) {
    console.error("Error creating route:", error);
    return NextResponse.json(
      { message: "Failed to create route" },
      { status: 500 }
    );
  }
}


