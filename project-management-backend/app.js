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

// app.js mein CORS enable karein
app.use(cors({ origin: "*" })); // Production mein aap isme Vercel ka live link bhi daal sakte hain
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