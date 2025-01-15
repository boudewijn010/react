import express from "express";
import playlistRouter from "./api/playlist.js";
import dotenv from "dotenv";
import process from "process";

// Configure dotenv to load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", playlistRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
