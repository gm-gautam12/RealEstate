import express from 'express';
import { user } from '../controllers/user.controllers.js';

const router = express.Router();

router.route('/test').get(user);


export default router;