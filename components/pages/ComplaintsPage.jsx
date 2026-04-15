"use client";

import { useState } from "react";
import { CheckCircle, Clock, MessageSquarePlus } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function ComplaintsPage() {
  const { complaints, createComplaint } = useAppContext();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      await createComplaint(message);
      setMessage("");
    } catch (error) {
      console.error("Failed to submit complaint:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support & Complaints</h1>
          <p className="mt-1 text-gray-500">Submit tickets and track their resolution status.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus size={20} className="text-primary-500" />
              Submit a New Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                className="min-h-[120px] w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="Describe your issue or feedback..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={loading || !message.trim()}>
                  {loading ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Your Tickets</h2>
          {complaints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
              You haven&apos;t submitted any tickets yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {complaints.map((complaint) => (
                <Card key={complaint.id}>
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="mb-1 font-medium text-gray-900">{complaint.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(complaint.createdAt || complaint.created_at || Date.now()).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      {complaint.status === "Resolved" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle size={14} /> Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
