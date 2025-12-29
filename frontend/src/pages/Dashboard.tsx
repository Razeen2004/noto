import "./Dashboard.css";
import { FiPlus, FiStar, FiTrash2, FiLogOut, FiChevronLeft, FiEdit2 } from "react-icons/fi";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { useToast } from "../toast/ToastContext";

interface Note {
    userId: string;
    _id: number;
    content: string;
    color: string;
    createdOn: string;
    starred?: boolean;
}

const availableColors = [
    "#2c2c2e",
    "#641e2b",
    "#1e3a5f",
    "#4a2c5e",
    "#3a4d1a",
    "#7a3d22",
];

export default function Dashboard() {
    const { showToast }: any = useToast();


    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    const [notes, setNotes] = useState<Note[]>([]);
    const [showColors, setShowColors] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<Note | any>(null);
    const [textValue, setTextValue] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [currentUser, setCurrentUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    const emptyDash = notes.length === 0;

    // Refs for GSAP
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUser();
        CheckNotes();
    }, []);

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
                showToast("Signed In", "success");
            }
            setCurrentUser({
                firstName: userData.user.firstName,
                lastName: userData.user.lastName,
                email: userData.user.email
            })

        } catch (error: any) {
            showToast("An error occured, please login", "erorr");
            setTimeout(() => {
                window.location.href = '/login'
            }, 2000)
        }
    }


    const CheckNotes = async () => {
        try {
            const checkNotes = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/get-all-notes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token") || "",
                }
            })
            const data = await checkNotes.json();
            console.log(data)
            setNotes(data.notes);
        } catch (error: any) {

        }
    }

    // GSAP Animation Logic
    useLayoutEffect(() => {
        if (modalOpen) {
            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
            gsap.fromTo(modalRef.current,
                { scale: 0.8, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
            );
        }
    }, [modalOpen]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setIsEdit(false);
        setTextValue("");
        setModalOpen(true);
    };

    const handleNoteClick = (note: Note) => {
        setIsEdit(true);
        setCurrentNote(note);
        setTextValue(note.content);
        setModalOpen(true);
        console.log(note);
    };

    const closeModal = () => {
        gsap.to(modalRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                setModalOpen(false);
                setShowColors(false);
            }
        });
    };

    const handleSave = async () => {
        if (!textValue.trim()) {
            closeModal();
            return;
        }

        try {
            if (isEdit && currentNote) {
                // UPDATE NOTE
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/notes/edit-note/${currentNote._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("token") || "",
                        },
                        body: JSON.stringify({
                            content: textValue,
                            starred: currentNote.starred,
                        }),
                    }
                );

                if (!res.ok) throw new Error("Update failed");

                CheckNotes();

                showToast("Note updated", "success");
            } else {
                // CREATE NOTE
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/add-note`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token") || "",
                    },
                    body: JSON.stringify({
                        content: textValue,
                        color: selectedColor,
                        starred: false,
                    }),
                });

                const data = await res.json();
                CheckNotes();

                showToast("Note added", "success");
            }
        } catch (err) {
            showToast("Something went wrong", "error");
        }

        closeModal();
    };

    const handleDelete = async () => {
        if (!currentNote) return;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/notes/delete-note/${currentNote._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                }
            );

            if (!res.ok) throw new Error("Delete failed");

            CheckNotes();
            showToast("Note deleted", "success");
        } catch {
            showToast("Failed to delete note", "error");
        }

        closeModal();
    };

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowColors(false);
    };

    const handleLogout = async () => {
        showToast("You have been logged out..", "success");
        showToast("Moving to Home Page..", "success");
        localStorage.removeItem("token");
        setTimeout(() => {
            window.location.href = "/";
        }, 2000)
    };

    const handleStar = async () => {
        if (!currentNote) return;

        const updatedStar = !currentNote.starred;

        try {
            await fetch(
                `${import.meta.env.VITE_API_URL}/api/notes/update-note-pinned/${currentNote._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token") || "",
                    },
                    body: JSON.stringify({ starred: updatedStar }),
                }
            );

            setCurrentNote({ ...currentNote, starred: updatedStar });

            CheckNotes();
        } catch {
            showToast("Failed to update star", "error");
        }
    };


    // Helper to split first line for display in the grid
    const getDisplayContent = (content: string) => {
        const lines = content.split('\n');
        return {
            title: lines[0] || "New Note",
            body: lines.slice(1).join(' ') || "No additional text"
        };
    };

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="add-container">
                    <button className="new-note-btn" onClick={() => setShowColors(!showColors)}>
                        <FiPlus />
                    </button>
                    <div className={`sidebar-colors ${showColors ? "visible" : ""}`}>
                        {availableColors.map((color) => (
                            <span key={color} style={{ background: color }} onClick={() => handleColorSelect(color)} />
                        ))}
                    </div>
                </div>
                <div className="profile-section">
                    <button
                        className="profile-btn"
                        onClick={handleProfileClick}
                        aria-label="User profile"
                    >
                        {getInitials(currentUser.firstName, currentUser.lastName)}
                    </button>

                    {showProfileMenu && (
                        <div className="profile-menu">
                            <div className="profile-menu-header">
                                <span className="profile-initials">
                                    {getInitials(currentUser.firstName, currentUser.lastName)}
                                </span>
                                <div>
                                    <p className="user-name">
                                        {currentUser.firstName} {currentUser.lastName}
                                    </p>
                                    <p className="user-email">{currentUser.email}</p>
                                </div>
                            </div>
                            <button className="logout-btn" onClick={handleLogout}>
                                <FiLogOut />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {emptyDash ? (
                <div className="notes-main">
                    <header className="notes-title">
                        <h1>Notes</h1>
                    </header>
                    <div className="no-notes">
                        <IoAdd size={50} color="#99999934" />
                    </div>
                </div>
            ) : (
                <main className="notes-main">
                    <header className="notes-title">
                        <h1>Notes</h1>

                    </header>

                    <div className="notes-grid">
                        {notes.map((note) => {
                            const { title, body } = getDisplayContent(note.content);
                            return (
                                <div key={note._id} className="note-card" style={{ backgroundColor: note.color }} onClick={() => handleNoteClick(note)}>
                                    <div className="note-content">
                                        <h3 className="note-heading">{title}</h3>
                                        <p className="note-description">{body}</p>
                                    </div>
                                    <div className="note-footer">
                                        <span className="note-date">{formatDate(note.createdOn)}</span>
                                        <div className="note-actions">
                                            {note.starred && <FaStar className="star-icon filled" />}
                                            <button className="edit-btn" aria-label="Edit note">
                                                <FiEdit2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            )}

            {modalOpen && (
                <div className="modal-overlay" ref={overlayRef}>
                    <div className="modal ios-modal" ref={modalRef} style={{ backgroundColor: isEdit ? currentNote?.color : selectedColor }}>
                        <div className="modal-nav">
                            <button onClick={handleSave} className="back-btn">
                                <FiChevronLeft /> Notes
                            </button>
                            <div className="modal-actions">
                                {currentNote?.starred ? <FaStar className="star-icon" onClick={handleStar} /> : <FaRegStar className="star-icon" onClick={handleStar} />}
                                {isEdit && <FiTrash2 onClick={handleDelete} className="action-icon" />}
                                <button onClick={handleSave} className="done-btn">Done</button>
                            </div>
                        </div>

                        <textarea
                            autoFocus
                            className="ios-textarea"
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                            placeholder="Start writing..."
                        />
                    </div>
                </div>
            )}
        </div>
    )
}