import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { addPet, listPets } from "@/lib/server/data";
import { apiError } from "@/lib/server/api-error";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json(await listPets(user));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();
    return NextResponse.json(await addPet(user, body), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
