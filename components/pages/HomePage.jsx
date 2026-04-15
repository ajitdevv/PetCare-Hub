"use client";

import Link from "next/link";
import { Heart, Scissors, ShieldCheck, Stethoscope } from "lucide-react";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export function HomePage() {
  const { services } = useAppContext();
  const featuredServices = services.slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 px-6 py-20 text-center shadow-inner sm:px-12 sm:py-28 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.16),transparent_26%)]" />
        <div className="relative z-10 mx-auto max-w-3xl space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Premium Care for Your <span className="text-primary-600">Best Friend</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
            The all-in-one platform for pet booking, tracking, and shopping. Because your
            pets deserve nothing but the absolute best.
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/services">
              <Button size="lg" className="h-14 w-full rounded-2xl px-8 text-lg font-semibold sm:w-auto">
                Book a Service
              </Button>
            </Link>
            <Link href="/pets">
              <Button variant="secondary" size="lg" className="h-14 w-full rounded-2xl px-8 text-lg font-semibold sm:w-auto">
                Manage Pets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose PetCare Hub?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            We provide a premium, seamless experience to ensure your peace of mind and your
            pet&apos;s happiness.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-none bg-white/60 backdrop-blur-sm">
            <CardContent className="space-y-4 p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 rotate-3 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Expert Vets</h3>
              <p className="text-gray-500">Connect with highly qualified professionals dedicated to your pet&apos;s health.</p>
            </CardContent>
          </Card>

          <Card className="border-none bg-white/60 backdrop-blur-sm">
            <CardContent className="space-y-4 p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 -rotate-3 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Loving Care</h3>
              <p className="text-gray-500">We treat every pet as if they were our own. Pure love and dedication.</p>
            </CardContent>
          </Card>

          <Card className="border-none bg-white/60 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <CardContent className="space-y-4 p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 rotate-3 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trusted Platform</h3>
              <p className="text-gray-500">Secure bookings, verified profiles, and seamless online management.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-10 rounded-3xl bg-secondary-50/50 p-8 sm:p-12 lg:p-16">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Services</h2>
            <p className="text-gray-500">Explore our most popular care options.</p>
          </div>
          <Link href="/services">
            <Button variant="ghost" className="font-semibold text-primary-600 hover:text-primary-700">
              View All Services &rarr;
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <Card key={service.id} className="group overflow-hidden">
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <div className="absolute inset-0 bg-primary-100 mix-blend-overlay transition-colors group-hover:bg-primary-50" />
                <div className="flex h-full w-full items-center justify-center text-primary-300 transition-transform duration-700 group-hover:scale-110">
                  {service.category === "Health" ? <Stethoscope size={64} /> : <Scissors size={64} />}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600">
                    {service.title}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-semibold text-secondary-800">
                    Rs {service.price}
                  </span>
                </div>
                <p className="mb-6 line-clamp-2 text-sm text-gray-500">{service.description}</p>
                <Link href="/services">
                  <Button variant="outline" className="w-full">Book Now</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
