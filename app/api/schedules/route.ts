import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Schedule } from "@/lib/models/schedule";
import { Route } from "@/lib/models/route";
import { Stoppage } from "@/lib/models/stoppage";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Ensure models are registered
    Route;
    Stoppage;
    
    const { searchParams } = new URL(req.url);
    const busId = searchParams.get("busId");
    const routeId = searchParams.get("routeId");
    
    const query: any = {};
    if (busId) query.bus = busId;
    if (routeId) query.route = routeId;
    
    const schedules = await Schedule.find(query)
      .populate("company", "name")
      .populate("bus", "number type rows columns aisleColumns seats")
      .populate({
        path: "route",
        select: "name from to stoppages",
        populate: [
          { path: "from", select: "name code" },
          { path: "to", select: "name code" },
          {
            path: "stoppages.place",
            select: "name code",
          },
        ],
      })
      .sort({ departureTime: 1 });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { message: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Ensure models are registered
    Route;
    Stoppage;
    
    const body = await req.json();
    const newSchedule = await Schedule.create(body);
    const populatedSchedule = await Schedule.findById(newSchedule._id)
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
    return NextResponse.json(populatedSchedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { message: "Failed to create schedule" },
      { status: 500 }
    );
  }
}

