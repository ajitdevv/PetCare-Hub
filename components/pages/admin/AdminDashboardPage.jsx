"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAppContext } from "@/components/providers/AppProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function AdminDashboardPage() {
  const { users, pets, bookings, orders, complaints } = useAppContext();
  const [bookingSearch, setBookingSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const totalUsers = users.length;
  const totalBookings = bookings.length;
  const totalOrders = orders.length;
  const totalComplaints = complaints.filter((complaint) => complaint.status !== "Resolved").length;
  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const serviceOptions = useMemo(
    () => [...new Set(bookings.map((booking) => booking.serviceType).filter(Boolean))].sort(),
    [bookings]
  );

  const filteredBookings = useMemo(() => {
    const query = bookingSearch.trim().toLowerCase();
    return [...bookings]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .filter((booking) => {
        const customer = users.find((user) => user.id === booking.userId);
        const pet = pets.find((item) => item.id === booking.petId);
        const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
        const matchesService = serviceFilter === "all" || booking.serviceType === serviceFilter;
        if (!query) return matchesStatus && matchesService;
        const searchableText = [booking.serviceType, booking.status, customer?.name, customer?.email, pet?.name, pet?.type]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return matchesStatus && matchesService && searchableText.includes(query);
      });
  }, [bookingSearch, bookings, pets, serviceFilter, statusFilter, users]);

  const recentComplaints = useMemo(
    () => [...complaints].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 8),
    [complaints]
  );

  return (
    <AuthGuard adminOnly>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
          <p className="mt-1 text-gray-500">Admin view of bookings, products, complaints, and overall platform activity.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Users", value: totalUsers, icon: Users, colors: "from-indigo-500 to-indigo-600" },
            { label: "Total Orders", value: totalOrders, icon: ShoppingBag, colors: "from-emerald-500 to-emerald-600" },
            { label: "Service Bookings", value: totalBookings, icon: CalendarCheck, colors: "from-amber-500 to-amber-600" },
            { label: "Open Tickets", value: totalComplaints, icon: TrendingUp, colors: "from-rose-500 to-rose-600" }
          ].map((item) => (
            <Card key={item.label} className={`border-none bg-gradient-to-br ${item.colors} text-white`}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-white/80">{item.label}</p>
                  <h4 className="mt-1 text-3xl font-bold">{item.value}</h4>
                </div>
                <item.icon size={32} className="text-white/70" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Complaints</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Complaint</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentComplaints.length === 0 ? (
                  <tr><td colSpan="4" className="bg-gray-50 px-6 py-8 text-center">No complaints submitted yet.</td></tr>
                ) : recentComplaints.map((complaint) => {
                  const complaintUser = users.find((user) => user.id === complaint.userId);
                  return (
                    <tr key={complaint.id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">{new Date(complaint.createdAt || Date.now()).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{complaintUser?.name || "Unknown User"}</div>
                        <div className="text-xs text-gray-500">{complaintUser?.email || "No email"}</div>
                      </td>
                      <td className="max-w-md px-6 py-4 text-gray-900">{complaint.message}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          complaint.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-rose-100">Product Revenue</p>
              <h4 className="mt-1 text-3xl font-bold">Rs {totalRevenue.toLocaleString("en-IN")}</h4>
            </div>
            <TrendingUp size={32} className="text-rose-200" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <Card className="xl:col-span-2">
            <CardHeader><CardTitle>Recent Product Orders</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Items Ordered</th>
                    <th className="px-6 py-4 font-semibold">Total Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr><td colSpan="5" className="bg-gray-50 px-6 py-8 text-center">No orders placed yet.</td></tr>
                  ) : orders.map((order) => {
                    const customer = users.find((user) => user.id === order.userId);
                    return (
                      <tr key={order.id} className="transition-colors hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">{new Date(order.createdAt || Date.now()).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{customer?.name || "Unknown"}</div>
                          <div className="text-xs text-gray-500">{customer?.email || ""}</div>
                        </td>
                        <td className="max-w-xs truncate px-6 py-4 text-xs text-gray-900">
                          {order.items?.map((item) => `${item.quantity}x ${item.name}`).join(", ") || "No items"}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">Rs {Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            order.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>User Directory & Pets</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User Details</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Pets Owned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const userPets = pets.filter((pet) => pet.owner === user.id);
                    return (
                      <tr key={user.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {userPets.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {userPets.map((pet) => (
                                <span key={pet.id} className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                                  {pet.name} ({pet.type})
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs italic text-gray-400">No pets added</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Global Service Bookings</CardTitle></CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Input placeholder="Search user, pet, or service" value={bookingSearch} onChange={(event) => setBookingSearch(event.target.value)} />
                <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
                  <option value="all">All Services</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">Showing {filteredBookings.length} of {bookings.length} bookings</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">User & Pet</th>
                      <th className="px-6 py-4 font-semibold">Service</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.length === 0 ? (
                      <tr><td colSpan="4" className="bg-gray-50 px-6 py-8 text-center">{bookings.length === 0 ? "No bookings found yet." : "No bookings match the selected filters."}</td></tr>
                    ) : filteredBookings.map((booking) => {
                      const customer = users.find((user) => user.id === booking.userId);
                      const pet = pets.find((item) => item.id === booking.petId);
                      const schedule = booking.date ? new Date(booking.date) : null;
                      const hasValidDate = schedule && !Number.isNaN(schedule.getTime());
                      return (
                        <tr key={booking.id} className="transition-colors hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {hasValidDate ? schedule.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "Date not set"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {hasValidDate ? schedule.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Time not set"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{customer?.name || "Unknown User"}</div>
                            <div className="text-xs text-gray-500">for {pet?.name || "Unknown Pet"}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-900">{booking.serviceType}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              booking.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
