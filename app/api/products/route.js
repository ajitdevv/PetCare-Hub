import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { addProduct, listProducts } from "@/lib/server/data";
import { apiError } from "@/lib/server/api-error";

export async function GET() {
  try {
    return NextResponse.json(await listProducts());
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();
    return NextResponse.json(await addProduct(user, body), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
