import { clearAuthCookie } from "@/lib/server/auth";

export async function POST() {
  return clearAuthCookie();
}
