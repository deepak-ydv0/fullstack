import express from "express";
import { registerUser, verifyUser } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyUser);
export default router;
