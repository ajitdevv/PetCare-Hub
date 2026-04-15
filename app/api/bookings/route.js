import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { addBooking, listBookings } from "@/lib/server/data";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json(await listBookings(user));
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();
    return NextResponse.json(await addBooking(user, body), { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
