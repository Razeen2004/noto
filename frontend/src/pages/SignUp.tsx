import { Link } from "react-router-dom";
import "./SignUp.css";
import { useState } from "react";
import { useToast } from "../toast/ToastContext";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { showToast }: any = useToast();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/create-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            const data = await response.json();
            if (data.error) {
                showToast(data.message, "error");
            } else {
                localStorage.setItem("token", data.accessToken);
                showToast(data.message, "success");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (

        <div className="signup">
            <div className="signup-card">
                <h2 className="signup-title">Sign Up</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <input type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" disabled={!firstName || !lastName || !email || !password} onClick={handleSubmit}>Sign Up</button>
                </form>
                <p className="signup-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
