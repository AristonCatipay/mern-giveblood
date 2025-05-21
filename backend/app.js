require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "giveblood",
    });
    console.info("Connected to MongoDB Atlas.");

    app.listen(process.env.PORT, () => {
      console.info(`Listening on port ${process.env.PORT}.`);
    });
  } catch (error) {
    console.error(
      `Error connecting to MongoDB or starting server: ${error.message}`
    );
  }
}

startServer();
