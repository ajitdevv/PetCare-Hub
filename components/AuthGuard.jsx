"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/providers/AppProvider";

export function AuthGuard({ children, adminOnly = false }) {
  const { user, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (adminOnly && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [adminOnly, isLoading, router, user]);

  if (isLoading || !user || (adminOnly && user.role !== "admin")) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return children;
}
