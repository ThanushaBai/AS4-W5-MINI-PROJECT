"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔥 Validation
    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
      router.push("/"); // or dashboard
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-rose-600">
            Cloud Kitchen Product Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to manage your kitchen menu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-rose-500"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-rose-500"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="bg-rose-600 hover:bg-rose-700 text-white w-full py-2 rounded-lg font-semibold">
            Login
          </button>
        </form>

        {/* 🔥 Register Link */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-rose-600 font-semibold hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}