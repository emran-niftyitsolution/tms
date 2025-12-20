import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Ticket } from "@/lib/models/ticket";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const scheduleId = searchParams.get("scheduleId");
    
    const query: any = {};
    if (scheduleId) query.schedule = scheduleId;
    
    const tickets = await Ticket.find(query)
      .populate("schedule", "departureTime arrivalTime price")
      .sort({ bookingDate: -1 });
    
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Check if any of the selected seats are already booked for this schedule
    for (const seat of body.seats) {
      const existingTicket = await Ticket.findOne({
        schedule: body.schedule,
        "seats.row": seat.row,
        "seats.column": seat.column,
        status: { $ne: "Cancelled" },
      });

      if (existingTicket) {
        return NextResponse.json(
          { message: `Seat ${seat.seatName || seat.seatNumber} is already booked` },
          { status: 400 }
        );
      }
    }

    const ticket = await Ticket.create(body);
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate({
        path: "schedule",
        populate: [
          { path: "bus", select: "number type" },
          { path: "route", select: "name from to", populate: [
            { path: "from", select: "name" },
            { path: "to", select: "name" },
          ]},
          { path: "company", select: "name" },
        ],
      })
      .populate("boardingPoint", "name")
      .populate("droppingPoint", "name");

    return NextResponse.json(populatedTicket, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create ticket" },
      { status: 500 }
    );
  }
}

