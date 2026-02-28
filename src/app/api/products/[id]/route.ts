import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// UPDATE
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  const updated = await Product.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  await Product.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted successfully" });
}