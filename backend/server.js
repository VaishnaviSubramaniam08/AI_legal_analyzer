import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import toolsRoutes from "./routes/toolsRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tools", toolsRoutes);

// CONNECT MONGO
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err.message));

app.listen(5000, () => console.log("Server running on port 5000"));
