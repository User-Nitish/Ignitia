import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

// ES6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check / Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ignitia API is up and running",
    version: "1.0.0"
  });
});

// Static folder for uploads
app.use("/uploads", (req, res, next) => {
  const decodedPath = decodeURIComponent(req.url);
  const fullPath = path.join(__dirname, "uploads", decodedPath);
  import('fs').then(fs => {
    if (fs.existsSync(fullPath)) {
      console.log(`[Static] Serving file: ${fullPath}`);
    } else {
      console.warn(`[Static] File not found: ${fullPath}`);
    }
  }).catch(() => {});
  next();
}, express.static(path.join(__dirname, "uploads")));

// Routes
console.log("Registering routes...");
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/ai', aiRoutes)
console.log("AI routes registered");
app.use('/api/quizzes', quizRoutes)
app.use('/api/progress', progressRoutes)

app.use(errorHandler);


// 404 handler
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`,
    statusCode: 404,
  });
});


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});