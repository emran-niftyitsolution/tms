import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Route } from "@/lib/models/route";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const route = await Route.findById(params.id)
      .populate("company", "name")
      .populate("from", "name code city")
      .populate("to", "name code city")
      .populate("stoppages.place", "name code city");

    if (!route) {
      return NextResponse.json(
        { message: "Route not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(route);
  } catch (error) {
    console.error("Error fetching route:", error);
    return NextResponse.json(
      { message: "Failed to fetch route" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const body = await req.json();

    const updatedRoute = await Route.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate("company", "name")
      .populate("from", "name code city")
      .populate("to", "name code city")
      .populate("stoppages.place", "name code city");

    if (!updatedRoute) {
      return NextResponse.json(
        { message: "Route not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRoute);
  } catch (error) {
    console.error("Error updating route:", error);
    return NextResponse.json(
      { message: "Failed to update route" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const deletedRoute = await Route.findByIdAndDelete(params.id);

    if (!deletedRoute) {
      return NextResponse.json(
        { message: "Route not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    return NextResponse.json(
      { message: "Failed to delete route" },
      { status: 500 }
    );
  }
}


