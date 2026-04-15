import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { createOrder, listOrders } from "@/lib/server/data";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json(await listOrders(user));
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();
    return NextResponse.json(await createOrder(user, body.items), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to place order" },
      { status: 400 }
    );
  }
}
