"use client";

import { PawPrint } from "lucide-react";
import { useAppContext } from "@/components/providers/AppProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function LayoutShell({ children }) {
  const { isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <PawPrint size={48} className="mb-4 animate-pulse text-primary-500" />
        <p className="text-lg font-medium text-gray-600">Loading PetCare Hub...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
