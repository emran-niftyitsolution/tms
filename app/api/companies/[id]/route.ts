import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Company from "@/lib/models/company";

// Helper to access params properly in Next.js 15+ / App Router
// params is a Promise or object depending on version, but safe way is to await it if it's a promise,
// though in standard handlers (req, { params }) params is usually an object.
// We'll type it loosely to avoid TS conflicts if versions vary.
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDatabase();
    const body = await req.json();

    const updatedCompany = await Company.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCompany) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { message: "Failed to update company" },
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
    const deletedCompany = await Company.findByIdAndDelete(params.id);

    if (!deletedCompany) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { message: "Failed to delete company" },
      { status: 500 }
    );
  }
}

