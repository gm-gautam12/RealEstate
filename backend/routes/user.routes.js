import express from 'express';
import { user,updateUser } from '../controllers/user.controllers.js';
import verifyUser from '../utils/verifyUser.js';

const router = express.Router();

router.route('/test').get(user);
router.route("/update/:id").post(verifyUser,updateUser);


export default router;