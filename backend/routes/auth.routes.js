import express from "express";
import { signup,signin, googleOAuth } from "../controllers/auth.controllers.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/google").post(googleOAuth);


export default router;