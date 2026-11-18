
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!formData.email || !formData.password) {
            setMessage("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password
            });

            setMessage(response.data.message);

            // Login successful
            router.push("/dashboard");

        } catch (error) {
            console.error("Login API Error:", error);

            setMessage(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "420px" }}>

                <h2 className="text-center mb-4">Welcome Back</h2>

                {message && (
                    <div className="alert alert-info">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center mt-3 mb-0">
                    Don't have an account?{" "}
                    <Link href="/register">Register Here</Link>
                </p>

            </div>
        </div>
    );
}
