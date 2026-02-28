import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// CREATE
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product);
}

// READ ALL
export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}