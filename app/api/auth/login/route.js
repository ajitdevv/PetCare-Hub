import { NextResponse } from "next/server";
import { attachAuthCookie, createToken } from "@/lib/server/auth";
import { loginUser } from "@/lib/server/data";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await loginUser(body);
    const response = NextResponse.json({ user });
    return attachAuthCookie(response, createToken(user));
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 400 }
    );
  }
}
