"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function AddPetPage() {
  const router = useRouter();
  const { addPet } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Pet name is required";
    if (formData.age !== "" && Number(formData.age) < 0) nextErrors.age = "Age cannot be negative";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await addPet({
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        age: formData.age !== "" ? Number(formData.age) : 0
      });
      router.push("/pets");
    } catch (error) {
      setErrors({ submit: error.message || "Failed to add pet. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add a New Pet</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Pet Name"
                placeholder="e.g. Max"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                error={errors.name}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Pet Type</label>
                <select
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  value={formData.type}
                  onChange={(event) => setFormData({ ...formData, type: event.target.value })}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input
                label="Breed"
                placeholder="e.g. Labrador"
                value={formData.breed}
                onChange={(event) => setFormData({ ...formData, breed: event.target.value })}
              />
              <Input
                label="Age (in years)"
                type="number"
                placeholder="e.g. 3"
                value={formData.age}
                onChange={(event) => setFormData({ ...formData, age: event.target.value })}
                error={errors.age}
              />

              {errors.submit && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errors.submit}
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={() => router.push("/pets")} className="w-full" disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Pet Details"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
