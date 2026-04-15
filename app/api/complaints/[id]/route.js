import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { resolveComplaint } from "@/lib/server/data";

export async function PUT(_request, { params }) {
  try {
    const user = await getSessionUser();
    return NextResponse.json(await resolveComplaint(user, params.id));
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to resolve complaint" },
      { status: error.message === "Admin access required" ? 403 : 400 }
    );
  }
}
