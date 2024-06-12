import express from 'express';
import { user,updateUser, deleteUser,getUserListings } from '../controllers/user.controllers.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

router.route('/test').get(user);
router.route("/update/:id").post(verifyToken,updateUser);
router.route("/delete/:id").delete(verifyToken,deleteUser);
router.route("/listings/:id").get(verifyToken,getUserListings);


export default router;