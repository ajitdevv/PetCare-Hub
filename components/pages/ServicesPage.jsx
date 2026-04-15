"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export function ServicesPage() {
  const { services, pets, user, bookAppointment } = useAppContext();
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const myPets = pets.filter((pet) => pet.owner === user?.id);

  function resetBookingForm() {
    setSelectedService(null);
    setSelectedPet("");
    setSelectedDay("");
    setSelectedTime("");
    setBookingError("");
  }

  async function confirmBooking() {
    setBookingError("");
    if (!selectedPet || !selectedDay || !selectedTime) {
      setBookingError("Please select your pet, day, and time.");
      return;
    }

    const scheduledAt = new Date(`${selectedDay}T${selectedTime}`);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() < Date.now()) {
      setBookingError("Please choose a future day and time.");
      return;
    }

    setBookingLoading(true);
    try {
      await bookAppointment({
        petId: selectedPet,
        serviceType: selectedService.title,
        date: scheduledAt.toISOString()
      });
      resetBookingForm();
      router.push("/dashboard");
    } catch (error) {
      setBookingError(error.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="space-y-10 pb-12">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Our Services</h1>
          <p className="text-lg text-gray-500">
            Premium care services tailored to your pet&apos;s exact needs. Book an appointment today.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex h-full flex-col border transition-colors hover:border-primary-200">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {service.category}
                  </span>
                  <span className="text-lg font-bold text-primary-600">Rs {service.price}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="mb-6 flex-1 text-gray-500">{service.description}</p>
                <div className="mb-6 text-sm font-medium text-gray-400">{service.duration}</div>
                <Button
                  onClick={() => setSelectedService(service)}
                  className="w-full"
                  variant={selectedService?.id === service.id ? "secondary" : "primary"}
                >
                  {selectedService?.id === service.id ? "Selected" : "Select Service"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedService ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md shadow-2xl">
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Book {selectedService.title}</h2>
                <p className="mb-6 text-gray-500">Which pet is this appointment for?</p>

                {myPets.length === 0 ? (
                  <div className="mb-6 rounded-xl bg-orange-50 p-4 text-center text-orange-800">
                    <p className="mb-4">You need to add a pet before booking.</p>
                    <Button onClick={() => router.push("/add-pet")} className="w-full" variant="outline">
                      Create a Pet Profile
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookingError && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {bookingError}
                      </div>
                    )}
                    <select
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      value={selectedPet}
                      onChange={(event) => setSelectedPet(event.target.value)}
                    >
                      <option value="" disabled>Select your pet</option>
                      {myPets.map((pet) => (
                        <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      value={selectedDay}
                      onChange={(event) => setSelectedDay(event.target.value)}
                    />
                    <input
                      type="time"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      value={selectedTime}
                      onChange={(event) => setSelectedTime(event.target.value)}
                    />
                    {selectedDay && selectedTime ? (
                      <div className="rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700">
                        Scheduled for{" "}
                        {new Date(`${selectedDay}T${selectedTime}`).toLocaleString([], {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    ) : null}
                    <div className="flex gap-4 pt-4">
                      <Button variant="ghost" onClick={resetBookingForm} className="flex-1" disabled={bookingLoading}>Cancel</Button>
                      <Button onClick={confirmBooking} className="flex-1" disabled={bookingLoading}>
                        {bookingLoading ? "Booking..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </AuthGuard>
  );
}
