import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Note from "../models/Note.js";

export const createAccount = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "36000m",
    });

    const preNote = new Note({
        content: "Welcome aboard! 🎉\nYour account has been created successfully.",
        color: "#641e2b",
        starred: false,
        userId: user._id,
    })

    await preNote.save();

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    const userInfo = await User.findOne({ email });

    if (!userInfo) {
        return res.status(400).json({
            error: true,
            message: "User not Found",
        });
    }

    const isMatch = await bcrypt.compare(password, userInfo.password);

    if (isMatch) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
};

export const getUser = async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            firstName: isUser.firstName,
            lastName: isUser.lastName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn,
        },
        message: "",
    });
};
