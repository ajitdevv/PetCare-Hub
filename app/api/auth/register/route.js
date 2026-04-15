import { NextResponse } from "next/server";
import { attachAuthCookie, createToken } from "@/lib/server/auth";
import { registerUser } from "@/lib/server/data";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await registerUser(body);
    const response = NextResponse.json({ user });
    return attachAuthCookie(response, createToken(user));
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}
