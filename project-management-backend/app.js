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

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://project-backend-f00j.onrender.com");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials",  "true");

    // Agar request OPTIONS (Preflight) hai, toh use aage mat bhejo, yahi se 200 OK dekar khatam karo
    if (req.method === "OPTIONS") {
        return res.sendStatus( 200 );
    }
    next();
});

app.use(morgan("dev"));

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