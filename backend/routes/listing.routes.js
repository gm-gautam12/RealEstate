import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createListing } from "../controllers/listing.controllers.js";

const router = express.Router();

export default router;

router.route("/create").post(verifyToken,createListing);