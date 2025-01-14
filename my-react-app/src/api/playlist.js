import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2/promise";
import process from "process";

const router = express.Router();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .getConnection()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

router.post("/playlists", async (req, res) => {
  const { userId, playlistId, title, tracks } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO playlists (user_id, playlist_id, title, tracks) VALUES (?, ?, ?, ?)",
      [userId, playlistId, title, JSON.stringify(tracks)]
    );
    res
      .status(201)
      .json({ id: result.insertId, userId, playlistId, title, tracks });
  } catch (error) {
    console.error("Error saving playlist to database:", error);
    res.status(500).json({ error: "Failed to save playlist to database" });
  }
});

router.get("/playlists", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM playlists ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching playlists from database:", error);
    res.status(500).json({ error: "Failed to fetch playlists from database" });
  }
});

export default router;
