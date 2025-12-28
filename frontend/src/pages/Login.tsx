import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";
import { useToast } from "../toast/ToastContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { showToast }: any = useToast();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.error) {
                showToast(data.message, "error");
            } else {
                localStorage.setItem("token", `bearer ${data.accessToken}`);
                showToast(data.message, "success");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 3000);
            }
        } catch (error: any) {
            showToast(error.message, "error");
        }
    };

    return (
        <div className="signin">
            <div className="signin-card">
                <h2 className="signin-title">Log In</h2>
                <form className="signin-form" onSubmit={handleSubmit}   >
                    <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" disabled={!email || !password} onClick={handleSubmit}>Sign In</button>
                </form>
                <p className="signin-footer">
                    Don't have an account? <Link to="/signup"> Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
