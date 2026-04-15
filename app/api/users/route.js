import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { listUsers } from "@/lib/server/data";
import { apiError } from "@/lib/server/api-error";

export async function GET() {
  try {
    const currentUser = await getSessionUser();
    const users = await listUsers(currentUser);
    return NextResponse.json(users);
  } catch (error) {
    return apiError(error);
  }
}
