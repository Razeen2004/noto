import Note from "../models/Note.js";

export const addNote = async (req, res) => {
    const { content, color, starred } = req.body;
    const { user } = req.user;

    if (!content) {
        return res.status(400).json({ error: true, message: "Heading and Description are required" });
    }

    try {
        const note = new Note({
            content,
            color,
            starred,
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export const editNote = async (req, res) => {
    const { noteId } = req.params;
    const { content, color, starred } = req.body;
    const { user } = req.user;

    if (!content && !color && starred === undefined) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (content) note.content = content;
        if (color) note.color = color;
        if (starred !== undefined) note.starred = starred;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export const getAllNotes = async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ starred: -1, createdOn: -1 });

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export const deleteNote = async (req, res) => {
    const { noteId } = req.params;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export const updateNotePinned = async (req, res) => {
    const { noteId } = req.params;
    const { starred } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.starred = starred;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note pinned status updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};
