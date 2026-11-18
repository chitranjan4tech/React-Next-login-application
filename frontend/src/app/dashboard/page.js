
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get logged-in user details
    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await api.get("/auth/profile");
                setUser(response.data.user);
            } catch (error) {
                if (error.response?.status === 401) {
                    router.replace("/login");
                } else {
                    setError("Unable to load user details.");
                }
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [router]);

    // Logout function
    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            router.replace("/login");
        } catch (error) {
            setError("Logout failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                Loading Dashboard...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container text-center py-5">
                {error || "Please login to continue."}
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="card shadow p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary mb-0">
                        My Dashboard
                    </h2>

                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                <h4 className="text-success mb-3">
                    Welcome, {user.name}!
                </h4>

                <hr />

                <h5>User Profile</h5>

                <p>
                    <strong>Name:</strong> {user.name}
                </p>

                <p>
                    <strong>Email:</strong> {user.email}
                </p>

                <p>
                    <strong>Mobile:</strong> {user.mobile || "Not provided"}
                </p>

                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}

            </div>
        </div>
    );
}
