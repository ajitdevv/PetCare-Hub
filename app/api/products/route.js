import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { addProduct, listProducts } from "@/lib/server/data";

export async function GET() {
  return NextResponse.json(await listProducts());
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();
    return NextResponse.json(await addProduct(user, body), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to add product" },
      { status: error.message === "Admin access required" ? 403 : 400 }
    );
  }
}
