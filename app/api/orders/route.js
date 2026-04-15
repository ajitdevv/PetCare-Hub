import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { createOrder, listOrders } from "@/lib/server/data";
import { apiError } from "@/lib/server/api-error";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json(await listOrders(user));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();
    return NextResponse.json(await createOrder(user, body.items), { status: 201 });
  } catch (error) {
    return apiError(error, 400);
  }
}
