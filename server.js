import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

/* =============================
   DATABASE CONNECTION
============================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* =============================
   ROOT ROUTE (Fixes Cannot GET /)
============================= */
app.get("/", (req, res) => {
  res.send("🚀 ClutchByte Enterprise Backend Running");
});

/* =============================
   HEALTH CHECK
============================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime()
  });
});

/* =============================
   CHAT ROUTE
============================= */
app.post("/chat", async (req, res) => {
  try {
    const { userId, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({ error: "AI response error", data });
    }

    const reply = data.choices[0].message.content;

    // Save to database
    if (userId) {
      await pool.query(
        "INSERT INTO chats(user_id, message) VALUES($1, $2)",
        [userId, reply]
      );
    }

    res.json(data);

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* =============================
   START SERVER
============================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
