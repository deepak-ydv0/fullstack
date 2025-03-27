import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utills/db.js";
import cookieParser from "cookie-parser";

//import routes
import userRoutes from "./routes/user.routes.js";

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
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

//connect Db
db();

//user routes
app.use("/api/v1/users", userRoutes);
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
