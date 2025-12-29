import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FiZap, FiLock, FiSearch, FiFeather } from "react-icons/fi"
import { FiGithub, FiTwitter, FiMail } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import logo from "../assets/note.svg"
import "./home.css";



export default function Home() {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetchUser();
    })

    const fetchUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/get-user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token") || "",
                }
            })
            const userData = await response.json();
            if (userData) {
                setLoggedIn(true)
            }
        } catch (error: any) {
            setLoggedIn(false)
        }
    }

    return (
        <>
            <div className="main-container">
                {/* Navbar */}
                <nav className="navbar">
                    <h2 className="logo"> <img src={logo} alt="note" width={25} /> Noto</h2>
                    <div className="nav-links">
                        <a href="#features">Features</a>
                        <a href="#faqs">FAQs</a>
                        {loggedIn ? (
                            <a className="nav-btn" href="/dashboard">Dashboard</a>
                        ) : (
                            <a className="nav-btn" href="/login">Log In</a>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-text">
                        <h1>
                            Your thoughts.<br />Beautifully organized.
                        </h1>
                        <p>
                            Capture ideas, plans, and reminders in a clean and focused notes
                            experience.
                        </p>
                        <div className="nav-links">
                            <a className="nav-btn" href="/login">Start Writing</a>
                        </div>
                    </div>

                    <div className="hero-preview">
                        <div className="notes">
                            <div className="note-ui">
                                <p className="note-text">
                                    The beginning of screenless design: UI jobs to be taken over by
                                    Solution Architect
                                </p>

                                <div className="note-footer">
                                    <span>May 21, 2020</span>
                                    <button className="edit-btn">
                                        <FiEdit2 />
                                    </button>
                                </div>
                            </div>
                            <div className="note-ui">
                                <div>
                                    <p className="note-text">
                                        The beginning of screenless design: UI jobs to be taken over by
                                        Solution Architect
                                    </p>
                                    <p className="note-desc">13 Things You Should Give Up If You Want To Be a Successful UX Designer</p>
                                </div>

                                <div className="note-footer">
                                    <span>May 21, 2020</span>
                                    <button className="edit-btn">
                                        <FiEdit2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="features">
                    <div className="features-header">
                        <h2>Designed to help you think better</h2>
                        <p>
                            Noto is built for focus, speed, and simplicity — so your ideas flow
                            without friction.
                        </p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-box">
                            <div className="feature-icon">
                                <FiZap />
                            </div>
                            <h3>Fast & Responsive</h3>
                            <p>
                                Write and edit notes instantly with a smooth, distraction-free
                                experience.
                            </p>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon">
                                <FiLock />
                            </div>
                            <h3>Secure by Default</h3>
                            <p>
                                Your notes are protected and stored safely, so your ideas stay private.
                            </p>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon">
                                <FiSearch />
                            </div>
                            <h3>Smart Organization</h3>
                            <p>
                                Quickly find what you need with powerful search and clean structure.
                            </p>
                        </div>

                        <div className="feature-box">
                            <div className="feature-icon">
                                <FiFeather />
                            </div>
                            <h3>Minimal & Focused</h3>
                            <p>
                                A calm interface designed to reduce noise and help you stay in flow.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="faqs" className="faqs">
                    <div className="faqs-header">
                        <h2>Questions? We’ve got answers.</h2>
                        <p>
                            Everything you need to know before you start writing your next idea.
                        </p>
                    </div>

                    <div className="faq-list">
                        <FaqItem
                            question="Is my data safe?"
                            answer="Yes. Your notes are securely stored and protected so your ideas remain private and accessible only to you."
                        />
                        <FaqItem
                            question="Can I use Noto on multiple devices?"
                            answer="Absolutely. Your notes stay in sync across devices, so you can pick up right where you left off."
                        />
                        <FaqItem
                            question="Is Noto free to use?"
                            answer="Yes. Noto is free to get started, with optional premium features planned for the future."
                        />
                        <FaqItem
                            question="Do I need an account to create notes?"
                            answer="You can explore Noto without an account. Creating one allows you to save and sync your notes."
                        />
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>Noto</h3>
                            <p>
                                A simple, focused notes app designed to help you capture and organize
                                your ideas effortlessly.
                            </p>
                        </div>

                        <div className="footer-links">
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <a href="#faqs">FAQs</a>
                            <a href="/signup">Get Started</a>
                        </div>

                        <div className="footer-links">
                            <h4>Connect</h4>
                            <div className="footer-icons">
                                <a href="#"><FiGithub /></a>
                                <a href="#"><FiTwitter /></a>
                                <a href="#"><FiMail /></a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© {new Date().getFullYear()} Noto. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}


function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`faq-item ${open ? "open" : ""}`}>
            <button className="faq-question" onClick={() => setOpen(!open)}>
                <span>{question}</span>
                <FiPlus className="faq-icon" />
            </button>

            {open && <p className="faq-answer">{answer}</p>}
        </div>
    );
}