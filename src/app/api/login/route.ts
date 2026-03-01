import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// jwt types sometimes missing; ignore until TS server reloads
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    console.log("Email:", email.toLowerCase());
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

  } catch (err: unknown) {
    // log the original error for debugging; keep the response generic
    console.error("Login error", err);
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}