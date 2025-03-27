import express from "express";
import {
  login,
  registerUser,
  verifyUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", login);
export default router;
