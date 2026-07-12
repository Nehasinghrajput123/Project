const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    const allowedOrigins = [
        "https://project-3-r0z5.onrender.com",
        "http://localhost:5173",
        "http://localhost:3000"
    ];

    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin === "*") {
                    callback(null, true);
                } else {
                    callback(new Error("CORS policy validation failed for this origin"));
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    console.log("⚡ Production-ready Socket.io pipeline initialized successfully.");

    io.on("connection", (socket) => {
        console.log(`🔌 Client connected on production: ${socket.id}`);

        // Event listener for a user entering a specific project board workspace
        socket.on("join:project", (projectId) => {
            socket.join(projectId);
            console.log(`📁 Socket ${socket.id} assigned to room: ${projectId}`);
        });

        // Event listener for a task state change or drag-and-drop movement
        socket.on("task:move", (data) => {
            const { projectId } = data;
            // Broadcast the updated task metrics instantly to all other members in the room
            socket.to(projectId).emit("task:updated", data);
        });

        socket.on("disconnect", () => {
            console.log(`❌ Client connection dropped: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO framework context not initialized");
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO,
};