import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { removeProduct } from "@/lib/server/data";
import { apiError } from "@/lib/server/api-error";

export async function DELETE(_request, { params }) {
  try {
    const user = await getSessionUser();
    await removeProduct(user, params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
