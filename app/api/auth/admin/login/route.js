import { NextResponse } from "next/server";
import { attachAuthCookie, createToken } from "@/lib/server/auth";
import { loginAdmin } from "@/lib/server/data";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await loginAdmin(body);
    const response = NextResponse.json({ user });
    return attachAuthCookie(response, createToken(user));
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Admin login failed" },
      { status: 403 }
    );
  }
}
