import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { getUserById } from "@/lib/server/data";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await getUserById(session.id);
  return NextResponse.json({ user });
}
