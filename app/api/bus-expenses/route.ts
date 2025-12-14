import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { BusExpense } from "@/lib/models/bus-expense";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const busId = searchParams.get("busId");
    
    const query = busId ? { bus: busId } : {};
    const expenses = await BusExpense.find(query)
      .populate("bus", "number")
      .sort({ date: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { message: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newExpense = await BusExpense.create(body);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { message: "Failed to create expense" },
      { status: 500 }
    );
  }
}


