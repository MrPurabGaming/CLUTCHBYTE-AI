const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ status: "ClutchByte API Running 🚀" });
});

// Chat route (POST only)
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  res.json({
    reply: "You said: " + message
  });
});

// Root
app.get("/", (req, res) => {
  res.send("🚀 ClutchByte Backend Running");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
