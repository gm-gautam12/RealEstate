import express from 'express';
import { user,updateUser } from '../controllers/user.controllers.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

router.route('/test').get(user);
router.route("/update/:id").post(verifyToken,updateUser);


export default router;