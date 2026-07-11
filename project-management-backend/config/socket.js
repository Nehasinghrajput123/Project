const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
    // Initialize standard Socket.io instance handling CORS policy mappings
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
    });

    console.log("⚡ Standard Socket.io pipeline initialized without Redis adapter");
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