
"use client";

import { useState } from "react";
import api from "@/services/api";
export default function RegisterPage() {

    // Store form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: ""
    });
const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission Register
    
const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const {
        name,
        email,
        mobile,
        password,
        confirmPassword
    } = formData;

    // Frontend validation
    if (!name || !email || !mobile || !password || !confirmPassword) {
        setMessage("Please fill all fields");
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        setMessage("Enter a valid 10 digit mobile number");
        return;
    }

    if (password.length < 8) {
        setMessage("Password must be at least 8 characters");
        return;
    }

    if (password !== confirmPassword) {
        setMessage("Password and Confirm Password do not match");
        return;
    }

    try {
        setLoading(true);

        // Send registration data to backend
        const response = await api.post("/auth/register", {
            name,
            email,
            mobile,
            password
        });

        setMessage(response.data.message);

        // Clear form after successful registration
        setFormData({
            name: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: ""
        });

    } catch (error) {

        const errorMessage =
            error.response?.data?.message ||
            "Registration failed. Please try again.";

        setMessage(errorMessage);

    } finally {
        setLoading(false);
    }
};


    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-7 col-lg-5">

                    <div className="card shadow border-0">

                        <div className="card-body p-4">

                            <h2 className="text-center mb-2">
                                Create Account
                            </h2>

                            <p className="text-center text-muted mb-4">
                                Register to get started
                            </p>

                            {message && (
                                <div className="alert alert-info">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Mobile Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="mobile"
                                        className="form-control"
                                        placeholder="10 digit mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Minimum 8 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
    type="submit"
    className="btn btn-primary w-100"
    disabled={loading}
>
    {loading ? "Registering..." : "Create Account"}
</button>

                            </form>

                            <p className="text-center mt-3 mb-0">
                                Already have an account?{" "}
                                <a href="/login">Login</a>
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
