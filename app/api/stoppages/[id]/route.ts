import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Stoppage } from "@/lib/models/stoppage";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const params = await props.params;
    const stoppage = await Stoppage.findById(params.id)
      .populate("company", "name")
      .populate("city", "name company status")
      .populate({
        path: "city",
        populate: { path: "company", select: "name" }
      });

    if (!stoppage) {
      return NextResponse.json(
        { message: "Stoppage not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(stoppage);
  } catch (error) {
    console.error("Error fetching stoppage:", error);
    return NextResponse.json(
      { message: "Failed to fetch stoppage" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const params = await props.params;
    const body = await req.json();

    const updatedStoppage = await Stoppage.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate("company", "name")
      .populate("city", "name company status")
      .populate({
        path: "city",
        populate: { path: "company", select: "name" }
      });

    if (!updatedStoppage) {
      return NextResponse.json(
        { message: "Stoppage not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStoppage);
  } catch (error: any) {
    console.error("Error updating stoppage:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Stoppage with this code already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update stoppage" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const params = await props.params;
    const deletedStoppage = await Stoppage.findByIdAndDelete(params.id);

    if (!deletedStoppage) {
      return NextResponse.json(
        { message: "Stoppage not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Stoppage deleted successfully" });
  } catch (error) {
    console.error("Error deleting stoppage:", error);
    return NextResponse.json(
      { message: "Failed to delete stoppage" },
      { status: 500 }
    );
  }
}

