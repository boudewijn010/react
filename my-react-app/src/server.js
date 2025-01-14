import express from "express";
import dotenv from "dotenv";
import process from "process";

// Configure dotenv to load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
