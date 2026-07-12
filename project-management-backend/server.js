require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");
const registerTaskSocket = require("./socket/task.socket");

const PORT = process.env.PORT || 5000;
connectDB();
const server = http.createServer(app);
const io = initializeSocket(server);
registerTaskSocket(io);
server.listen(PORT, () => {
    console.log(`🚀 Production server fully operational on port ${PORT}`);
});