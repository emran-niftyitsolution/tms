import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { City } from "@/lib/models/city";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const params = await props.params;
    const city = await City.findById(params.id).populate("company", "name");

    if (!city) {
      return NextResponse.json(
        { message: "City not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(city);
  } catch (error) {
    console.error("Error fetching city:", error);
    return NextResponse.json(
      { message: "Failed to fetch city" },
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

    const updatedCity = await City.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate("company", "name");

    if (!updatedCity) {
      return NextResponse.json(
        { message: "City not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCity);
  } catch (error: any) {
    console.error("Error updating city:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "name";
      const value = error.keyValue?.[field] || "";
      const fieldName = field === "name" ? "name" : "code";
      return NextResponse.json(
        { message: `City with this ${fieldName} "${value}" already exists. Please use a different ${fieldName}.` },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Failed to update city" },
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
    const deletedCity = await City.findByIdAndDelete(params.id);

    if (!deletedCity) {
      return NextResponse.json(
        { message: "City not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json(
      { message: "Failed to delete city" },
      { status: 500 }
    );
  }
}

