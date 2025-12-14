import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { City } from "@/lib/models/city";

export async function GET() {
  try {
    await connectToDatabase();
    const cities = await City.find({})
      .populate("company", "name")
      .sort({ name: 1 });
    return NextResponse.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { message: "Failed to fetch cities" },
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
        { message: "City name is required" },
        { status: 400 }
      );
    }

    if (!body.company) {
      return NextResponse.json(
        { message: "Company is required" },
        { status: 400 }
      );
    }

    const newCity = await City.create(body);
    const populatedCity = await City.findById(newCity._id).populate(
      "company",
      "name"
    );
    return NextResponse.json(populatedCity, { status: 201 });
  } catch (error: any) {
    console.error("Error creating city:", error);
    
    // Handle duplicate key error (unique constraint violation)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "name";
      const value = error.keyValue?.[field] || "";
      const fieldName = field === "name" ? "name" : "code";
      return NextResponse.json(
        { message: `City with this ${fieldName} "${value}" already exists. Please use a different ${fieldName}.` },
        { status: 400 }
      );
    }
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors || {}).map((err: any) => err.message);
      return NextResponse.json(
        { message: messages.join(", ") || "Validation error" },
        { status: 400 }
      );
    }
    
    // Return the actual error message if available
    return NextResponse.json(
      { message: error.message || "Failed to create city" },
      { status: 500 }
    );
  }
}

