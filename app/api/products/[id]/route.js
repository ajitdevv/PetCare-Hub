import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { removeProduct } from "@/lib/server/data";

export async function DELETE(_request, { params }) {
  try {
    const user = await getSessionUser();
    await removeProduct(user, params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unable to delete product" },
      { status: error.message === "Admin access required" ? 403 : 400 }
    );
  }
}
