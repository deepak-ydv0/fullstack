import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utills/db.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});
db()
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
