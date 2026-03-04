const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection (Optional but Ready)
let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  console.log("✅ Database Connected");
} else {
  console.log("⚠ No DATABASE_URL Found");
}

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ status: "ClutchByte API Running 🚀" });
});

// Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Save message to database (if connected)
    if (pool) {
      await pool.query(
        "CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, content TEXT)"
      );

      await pool.query("INSERT INTO messages (content) VALUES ($1)", [
        message,
      ]);
    }

    // Simple reply (you can replace with OpenAI later)
    res.json({
      reply: "You said: " + message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 ClutchByte Enterprise Backend Running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
