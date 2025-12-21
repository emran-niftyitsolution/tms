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
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    const passengers = searchParams.get("passengers") || "1";

    if (!from || !to || !date) {
      return NextResponse.json(
        { message: "from, to, and date are required" },
        { status: 400 }
      );
    }

    // Find all schedules that are marked to show on web
    const query: any = {
      showOnWeb: true,
      status: { $ne: "Cancelled" }, // Don't show cancelled trips
    };

    // Filter by date (match the date part of departureTime)
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    query.departureTime = {
      $gte: startOfDay,
      $lte: endOfDay,
    };

    const schedules = await Schedule.find(query)
      .populate("company", "name")
      .populate("bus", "number type")
      .populate({
        path: "route",
        select: "name from to",
        populate: [
          { path: "from", select: "name code" },
          { path: "to", select: "name code" },
        ],
      })
      .sort({ departureTime: 1 });

    // Filter schedules by route matching (from and to cities)
    const filteredSchedules = schedules.filter((schedule: any) => {
      if (!schedule.route) return false;

      const route = schedule.route;
      const routeFrom =
        typeof route.from === "object" ? route.from.name : route.from;
      const routeTo = typeof route.to === "object" ? route.to.name : route.to;

      // Case-insensitive matching
      const fromMatch =
        routeFrom?.toLowerCase().includes(from.toLowerCase()) ||
        from.toLowerCase().includes(routeFrom?.toLowerCase() || "");
      const toMatch =
        routeTo?.toLowerCase().includes(to.toLowerCase()) ||
        to.toLowerCase().includes(routeTo?.toLowerCase() || "");

      return fromMatch && toMatch;
    });

    return NextResponse.json(filteredSchedules);
  } catch (error) {
    console.error("Error searching schedules:", error);
    return NextResponse.json(
      { message: "Failed to search schedules" },
      { status: 500 }
    );
  }
}

