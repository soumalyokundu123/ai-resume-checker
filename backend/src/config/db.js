const dns = require("dns");
const mongoose = require("mongoose");
const env = require("./env");

// Fix Windows DNS resolver issues with MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Keep system default if custom servers cannot be set
}

mongoose.set("strictQuery", true);

async function connectDB() {
  const conn = await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.log(
    `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
  );

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
}

module.exports = { connectDB };