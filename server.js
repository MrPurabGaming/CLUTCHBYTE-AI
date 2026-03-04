const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.get("/api/test", (req, res) => {
  res.json({ status: "ClutchByte API Running 🚀" });
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  res.json({ reply: "You said: " + message });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
