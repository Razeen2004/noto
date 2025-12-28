import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    color: { type: String, default: "#ffffff" },
    starred: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdOn: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
