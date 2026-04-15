"use client";

import { Activity, CalendarDays, Clock, PawPrint } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAppContext } from "@/components/providers/AppProvider";
import { Card, CardContent } from "@/components/ui/Card";

export function DashboardPage() {
  const { user, pets, bookings, services } = useAppContext();
  const myPets = pets.filter((pet) => pet.owner === user?.id);
  const myBookings = bookings.filter((booking) => booking.userId === user?.id);
  const upcomingBookings = myBookings.filter((booking) => booking.status === "upcoming");
  const pastBookings = myBookings.filter((booking) => booking.status === "completed");

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-gray-500">Here is an overview of your activity and upcoming schedules.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Pets", value: myPets.length, icon: PawPrint, colors: "bg-blue-100 text-blue-600" },
            { label: "Upcoming Services", value: upcomingBookings.length, icon: CalendarDays, colors: "bg-orange-100 text-orange-600" },
            { label: "Past Services", value: pastBookings.length, icon: Activity, colors: "bg-green-100 text-green-600" },
            { label: "Active Since", value: "Today", icon: Clock, colors: "bg-purple-100 text-purple-600" }
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.colors}`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  <h4 className="text-2xl font-bold text-gray-900">{item.value}</h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
