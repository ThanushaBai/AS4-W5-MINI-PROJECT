"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔥 Frontend Validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully");
      router.push("/login");
    } else {
      setError(data.error);
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
            Register to manage your kitchen menu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-rose-500"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

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
            Register
          </button>
        </form>

        {/* 🔥 Login Link Added */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-rose-600 font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}