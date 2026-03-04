import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post("/chat", async (req, res) => {
  const { userId, messages } = req.body;

  try {
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
    const reply = data.choices[0].message.content;

    await pool.query(
      "INSERT INTO chats(user_id, message) VALUES($1,$2)",
      [userId, reply]
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(process.env.PORT || 10000, () =>
  console.log("Enterprise AI running 🚀")
);
