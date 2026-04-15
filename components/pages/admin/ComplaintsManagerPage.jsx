"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function ComplaintsManagerPage() {
  const { complaints, users, resolveComplaint } = useAppContext();
  const [resolveError, setResolveError] = useState("");

  async function markResolved(id) {
    setResolveError("");
    try {
      await resolveComplaint(id);
    } catch (error) {
      setResolveError(error.message || "Failed to resolve ticket.");
    }
  }

  return (
    <AuthGuard adminOnly>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Tickets</h1>
          <p className="mt-1 text-gray-500">Review user complaints and resolve them.</p>
        </div>

        {resolveError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{resolveError}</div>
        )}

        <Card>
          <CardHeader><CardTitle>All Support Tickets</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center italic text-gray-400">No active tickets.</td></tr>
                ) : complaints.map((complaint) => {
                  const complaintUser = users.find((user) => user.id === complaint.userId);
                  return (
                    <tr key={complaint.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {complaintUser?.name || "Unknown User"}
                        <br />
                        <span className="text-xs font-normal text-gray-500">{complaintUser?.email || ""}</span>
                      </td>
                      <td className="min-w-[300px] px-6 py-4">
                        <p className="line-clamp-2 text-gray-700">{complaint.message}</p>
                        <span className="text-xs text-gray-400">{new Date(complaint.createdAt || Date.now()).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          complaint.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {complaint.status === "Pending" ? (
                          <Button variant="outline" size="sm" onClick={() => markResolved(complaint.id)} className="border-green-200 text-green-600 hover:bg-green-50">
                            <CheckCircle size={14} className="mr-1.5" /> Resolve
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
