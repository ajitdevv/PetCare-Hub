"use client";

import Link from "next/link";
import { Calendar, PawPrint, Plus } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export function PetsPage() {
  const { user, pets, bookings } = useAppContext();
  const myPets = pets.filter((pet) => pet.owner === user?.id);

  return (
    <AuthGuard>
      {myPets.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 rounded-full bg-gray-100 p-6">
            <PawPrint size={48} className="text-gray-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">No Pets Found</h2>
          <p className="mb-8 max-w-md text-gray-500">
            You haven&apos;t added any pets to your profile yet. Add your furry friends to
            start booking services and tracking their health.
          </p>
          <Link href="/add-pet">
            <Button className="gap-2">
              <Plus size={18} /> Add Your First Pet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
              <p className="mt-1 text-gray-500">Manage your pets and their information.</p>
            </div>
            <Link href="/add-pet">
              <Button className="w-full gap-2 sm:w-auto">
                <Plus size={18} /> Add New Pet
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myPets.map((pet) => {
              const petBookings = bookings.filter((booking) => booking.petId === pet.id);
              const upcoming = petBookings.filter((booking) => booking.status === "upcoming").length;
              return (
                <Card key={pet.id} className="transition-transform duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative h-32 rounded-t-2xl bg-gradient-to-r from-primary-400 to-primary-600">
                      <div className="absolute -bottom-10 left-6 flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 shadow-md">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-50">
                          <PawPrint className="text-primary-400" size={32} />
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-14">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                        <span className="inline-flex rounded-full bg-blue-50 px-2 text-xs font-semibold leading-5 text-blue-700">
                          {pet.type}
                        </span>
                      </div>
                      <div className="mb-4 space-y-1 text-sm text-gray-500">
                        <p>Breed: <span className="font-medium text-gray-700">{pet.breed || "Not set"}</span></p>
                        <p>Age: <span className="font-medium text-gray-700">{pet.age} years</span></p>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-600">
                        <Calendar size={16} />
                        <span>
                          {upcoming > 0 ? `${upcoming} Upcoming Appointment(s)` : "No upcoming appointments"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
