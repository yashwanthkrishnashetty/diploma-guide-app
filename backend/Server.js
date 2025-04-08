const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        process.env.CLIENT_URL,  // Allow frontend
        process.env.ADMIN_URL   // Allow admin
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // Allow cookies if necessary
}));

// Ensure 'uploads' directory exists
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ✅ Define User Schema directly in `server.js`
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}));

// Signup Endpoint
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ error: "Only Gmail addresses are allowed." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Server error during signup." });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found. Please sign up." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect password. Try again." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login." });
  }
});


// 📌 Middleware for Protected Routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Access Denied! No token provided." });

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

// 📌 Example Protected Route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Access Granted!" });
});

// 📌 Define Schema for Subjects & PDFs
const SubjectSchema = new mongoose.Schema({
  branch: String,
  semester: Number,
  name: String,
  pdfPath: String,
});

const Subject = mongoose.model("Subject", SubjectSchema);

// 📌 Configure Multer Storage for PDF Uploads
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${sanitizedFilename}`);
  },
});

const upload = multer({ storage });

// 📌 Upload PDFs Route
app.post("/upload", verifyToken, upload.single("pdf"), async (req, res) => {
  try {
    const { branch, semester, name } = req.body;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const pdfPath = `/uploads/${req.file.filename}`;

    const newSubject = new Subject({
      branch,
      semester,
      name,
      pdfPath,
    });

    await newSubject.save();
    res.json({ message: "PDF uploaded successfully", pdfPath });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload PDF", error: error.message });
  }
});

// 📌 Fetch all PDFs
app.get("/pdfs", async (req, res) => {
  try {
    const pdfs = await Subject.find();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

// 📌 Serve PDFs from 'uploads' folder
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (req, res) => res.send("Express App is Running"));

// 📌 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));