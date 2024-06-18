import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createListing,deleteListing,updateListing,getListing,getListings } from "../controllers/listing.controllers.js";

const router = express.Router();

export default router;

router.route("/create").post(verifyToken,createListing);
router.route("/delete/:id").delete(verifyToken,deleteListing);
router.route("/update/:id").put(verifyToken,updateListing);
router.route("/get/:id").get(getListing);
router.route("/get").get(getListings);