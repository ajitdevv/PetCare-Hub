import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { addPet, listPets } from "@/lib/server/data";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json(await listPets(user));
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();
    return NextResponse.json(await addPet(user, body), { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
