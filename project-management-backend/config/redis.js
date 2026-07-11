const { createClient } = require("redis");

// Initialize Redis clients with environmental variable falling back to localhost
const pubClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

const subClient = pubClient.duplicate();

// Global connection event error tracking to intercept unexpected disconnects
pubClient.on("error", (err) => console.error("Redis Pub Client Failure:", err));
subClient.on("error", (err) => console.error("Redis Sub Client Failure:", err));

const connectRedis = async () => {
    // Explicitly connection handshakes required for Redis v4+
    await pubClient.connect();
    await subClient.connect();
    console.log("✅ Redis Pipeline Synchronized Successfully");
};

module.exports = {
    connectRedis,
    pubClient,
    subClient,
};