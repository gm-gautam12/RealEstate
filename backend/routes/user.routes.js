import express from 'express';
import { user,updateUser, deleteUser,getUserListings,getUser } from '../controllers/user.controllers.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

router.route('/test').get(user);
router.route("/update/:id").post(verifyToken,updateUser);
router.route("/delete/:id").delete(verifyToken,deleteUser);
router.route("/listings/:id").get(verifyToken,getUserListings);
router.route("/:id").get(verifyToken,getUser);


export default router;