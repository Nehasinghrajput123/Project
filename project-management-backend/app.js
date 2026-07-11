require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");

const errorHandler = require("./middleware/error.middleware");

const app = express();

/* ----------------------------- Middlewares ----------------------------- */

app.use(cors({
    origin: "https://project-3-r0z5.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ---------------------------- Health Check ----------------------------- */

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Project Management System API is running successfully."
    });
});

/* ------------------------------- Routes ------------------------------- */

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

/* ------------------------------ 404 Route ------------------------------ */

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

/* --------------------------- Global Error ------------------------------ */

app.use(errorHandler);

module.exports = app;