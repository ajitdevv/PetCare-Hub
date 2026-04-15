import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { listUsers } from "@/lib/server/data";

export async function GET() {
  try {
    const currentUser = await getSessionUser();
    const users = await listUsers(currentUser);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to load users" },
      { status: error.message === "Admin access required" ? 403 : 401 }
    );
  }
}
