import express from "express";
import { signup,signin, googleOAuth,signOut } from "../controllers/auth.controllers.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/google").post(googleOAuth);
router.route("/signout").get(signOut);


export default router;