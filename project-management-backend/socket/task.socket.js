const jwt = require("jsonwebtoken");

const registerTaskSocket = (io) => {

    /**
     * Socket Authentication
     */
    io.use((socket, next) => {

        try {

            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication failed."));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.user = decoded;

            next();

        } catch (error) {
            return next(new Error("Invalid token."));
        }

    });

    /**
     * Connection
     */
    io.on("connection", (socket) => {

        console.log("=====================================");
        console.log(`User Connected : ${socket.id}`);
        console.log("=====================================");

        /**
         * Join Project Room
         */
        socket.on("joinProject", (projectId) => {

            socket.join(projectId);
            console.log("djhdjedjedj",socket)

            console.log(
                `${socket.user.id} joined project ${projectId}`
            );

            socket.emit("joinedProject", {
                success: true,
                message: "Joined project successfully.",
                projectId,
            });

        });

        /**
         * Leave Project Room
         */
        socket.on("leaveProject", (projectId) => {

            socket.leave(projectId);

            console.log(
                `${socket.user.email} left project ${projectId}`
            );

            socket.emit("leftProject", {
                success: true,
                message: "Left project successfully.",
                projectId,
            });

        });

        /**
         * Task Created
         */
        socket.on("taskCreated", (data) => {

            io.to(data.projectId).emit("taskCreated", data);

        });

        /**
         * Task Updated
         */
        socket.on("taskUpdated", (data) => {
console.log("wdbwgdygdyegdyegdye",data)
            io.to(data.projectId).emit("taskUpdated", data);

        });

        // Isko apne io.on("connection", (socket) => { ... }) ke andar daalein:

socket.on("changeTaskStatus", async (data) => {
    try {
        const { taskId, projectId, newStatus } = data;
        
        // 🎯 Tasks model ko upar require/import kar lena file mein
        const Tasks = require("../models/task.model"); 

        // 1. Database ko socket ke andar hi update karein
        const updatedTask = await Tasks.findByIdAndUpdate(
            taskId,
            { status: newStatus },
            { new: true, runValidators: true }
        )
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");

        if (updatedTask) {
            console.log("evhedhegdhegd")
            io.to(projectId).emit("taskUpdated", updatedTask);
        }
    } catch (error) {
        console.error("Socket status update error:", error.message);
        // User ko error back-emit kar sakte hain agar zaroorat ho
        socket.emit("error", "Failed to update status via server pipeline.");
    }
});

        /**
         * Task Deleted
         */
        socket.on("taskDeleted", (data) => {

            io.to(data.projectId).emit("taskDeleted", data);

        });

        /**
         * Disconnect
         */
        socket.on("disconnect", () => {

            console.log("=====================================");
            console.log(`User Disconnected : ${socket.id}`);
            console.log("=====================================");

        });

    });

};

module.exports = registerTaskSocket;