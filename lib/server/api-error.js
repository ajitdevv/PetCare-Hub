import { NextResponse } from "next/server";

const AUTH_MESSAGES = new Set(["Unauthorized", "Invalid credentials", "Invalid admin credentials"]);
const FORBIDDEN_MESSAGES = new Set(["Admin access required"]);

export function apiError(error, fallbackStatus = 500) {
  const message = error?.message || "Internal server error";
  let status = fallbackStatus;
  if (AUTH_MESSAGES.has(message)) status = 401;
  else if (FORBIDDEN_MESSAGES.has(message)) status = 403;
  else if (fallbackStatus === 500) status = 500;
  return NextResponse.json({ message }, { status });
}
