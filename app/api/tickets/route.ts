import connectToDatabase from "@/lib/db";
import { Ticket } from "@/lib/models/ticket";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const scheduleId = searchParams.get("scheduleId");
    const boardingPoint = searchParams.get("boardingPoint");
    const droppingPoint = searchParams.get("droppingPoint");

    const includeCancelled = searchParams.get("includeCancelled") === "true";
    const query: { schedule?: string; status?: { $ne: string } } = {};
    if (scheduleId) query.schedule = scheduleId;
    // Only filter out cancelled tickets if includeCancelled is not true
    if (!includeCancelled) {
      query.status = { $ne: "Cancelled" }; // Only get non-cancelled tickets for seat availability
    }

    const tickets = await Ticket.find(query)
      .populate("schedule", "departureTime arrivalTime price")
      .populate({
        path: "schedule",
        populate: [
          {
            path: "route",
            select: "name from to stoppages",
            populate: [
              { path: "from", select: "name" },
              { path: "to", select: "name" },
              { path: "stoppages.place", select: "name" },
            ],
          },
          { path: "bus", select: "number type" },
          { path: "company", select: "name" },
        ],
      })
      .populate("boardingPoint", "name")
      .populate("droppingPoint", "name")
      .sort({ bookingDate: -1 });

    // Filter tickets based on route overlap if boarding/dropping points are provided
    let filteredTickets = tickets;
    if (boardingPoint && droppingPoint && tickets.length > 0) {
      // Get route sequence from the first ticket's schedule (all tickets should have same route)
      const firstTicket = tickets[0] as {
        schedule?: {
          route?: { from?: unknown; to?: unknown; stoppages?: unknown[] };
        };
      };
      const route = firstTicket.schedule?.route;

      if (route && typeof route === "object" && !Array.isArray(route)) {
        // Build route sequence: from -> stoppages -> to
        const routeSequence: string[] = [];

        // Add from
        if (route.from) {
          const fromId =
            typeof route.from === "object" &&
            route.from !== null &&
            "_id" in route.from
              ? String(route.from._id)
              : String(route.from);
          routeSequence.push(fromId);
        }

        // Add stoppages in order
        if (Array.isArray(route.stoppages)) {
          route.stoppages.forEach((stop: unknown) => {
            if (
              stop &&
              typeof stop === "object" &&
              "place" in stop &&
              stop.place
            ) {
              const place = stop.place;
              const placeId =
                typeof place === "object" && place !== null && "_id" in place
                  ? String(place._id)
                  : String(place);
              if (!routeSequence.includes(placeId)) {
                routeSequence.push(placeId);
              }
            }
          });
        }

        // Add to
        if (route.to) {
          const toId =
            typeof route.to === "object" &&
            route.to !== null &&
            "_id" in route.to
              ? String(route.to._id)
              : String(route.to);
          if (!routeSequence.includes(toId)) {
            routeSequence.push(toId);
          }
        }

        // Get indices for selected boarding and dropping points
        const boardingIndex = routeSequence.indexOf(boardingPoint);
        const droppingIndex = routeSequence.indexOf(droppingPoint);

        if (
          boardingIndex !== -1 &&
          droppingIndex !== -1 &&
          boardingIndex < droppingIndex
        ) {
          // Filter tickets: a ticket overlaps if its boarding <= selected boarding AND its dropping >= selected dropping
          filteredTickets = tickets.filter(
            (ticket: { boardingPoint?: unknown; droppingPoint?: unknown }) => {
              const ticketBoardingId = ticket.boardingPoint
                ? typeof ticket.boardingPoint === "object" &&
                  ticket.boardingPoint !== null &&
                  "_id" in ticket.boardingPoint
                  ? String(ticket.boardingPoint._id)
                  : String(ticket.boardingPoint)
                : null;
              const ticketDroppingId = ticket.droppingPoint
                ? typeof ticket.droppingPoint === "object" &&
                  ticket.droppingPoint !== null &&
                  "_id" in ticket.droppingPoint
                  ? String(ticket.droppingPoint._id)
                  : String(ticket.droppingPoint)
                : null;

              if (!ticketBoardingId || !ticketDroppingId) return true; // Include tickets without boarding/dropping info

              const ticketBoardingIndex =
                routeSequence.indexOf(ticketBoardingId);
              const ticketDroppingIndex =
                routeSequence.indexOf(ticketDroppingId);

              if (ticketBoardingIndex === -1 || ticketDroppingIndex === -1)
                return true; // Include if not found in sequence

              // Overlap logic: ticket overlaps if it starts before/at selected boarding AND ends after/at selected dropping
              return (
                ticketBoardingIndex <= boardingIndex &&
                ticketDroppingIndex >= droppingIndex
              );
            }
          );
        }
      }
    }

    return NextResponse.json(filteredTickets);
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
          {
            message: `Seat ${
              seat.seatName || seat.seatNumber
            } is already booked`,
          },
          { status: 400 }
        );
      }
    }

    const ticket = await Ticket.create(body);
    // Type guard: ensure ticket is not an array and has _id
    const ticketDoc = ticket as { _id?: unknown } | null;
    const ticketId =
      ticketDoc && "_id" in ticketDoc && ticketDoc._id
        ? String(ticketDoc._id)
        : null;
    if (!ticketId) {
      return NextResponse.json(
        { message: "Failed to create ticket" },
        { status: 500 }
      );
    }
    const populatedTicket = await Ticket.findById(ticketId)
      .populate({
        path: "schedule",
        populate: [
          { path: "bus", select: "number type" },
          {
            path: "route",
            select: "name from to",
            populate: [
              { path: "from", select: "name" },
              { path: "to", select: "name" },
            ],
          },
          { path: "company", select: "name" },
        ],
      })
      .populate("boardingPoint", "name")
      .populate("droppingPoint", "name");

    return NextResponse.json(populatedTicket, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating ticket:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create ticket";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
