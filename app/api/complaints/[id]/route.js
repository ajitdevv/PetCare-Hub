import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { resolveComplaint } from "@/lib/server/data";
import { apiError } from "@/lib/server/api-error";

export async function PUT(_request, { params }) {
  try {
    const user = await getSessionUser();
    return NextResponse.json(await resolveComplaint(user, params.id));
  } catch (error) {
    return apiError(error);
  }
}
