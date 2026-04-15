"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, user } = useAppContext();
  const [loginAs, setLoginAs] = useState(searchParams.get("role") === "admin" ? "admin" : "user");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    router.replace(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
  }, [router, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(formData.email, formData.password, loginAs);
      router.replace(result.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-t-4 border-t-primary-500 shadow-xl">
        <CardHeader className="pb-4 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <LogIn className="text-primary-600" size={24} />
          </div>
          <CardTitle className="text-3xl font-extrabold text-gray-900">Welcome Back</CardTitle>
          <p className="mt-2 text-sm text-gray-600">Please sign in to continue</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Login As</p>
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setLoginAs("user")}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    loginAs === "user" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setLoginAs("admin")}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    loginAs === "admin" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <Input
              label="Email address"
              type="email"
              required
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            />

            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-500">
              Register now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
