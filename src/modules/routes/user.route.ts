import { Router } from 'express';
import { signupUserController,verifyOtpController } from '../controllers/user.controller';
const router = Router();
router.post('/signup-user1', signupUserController);
router.post('/verify-otp', verifyOtpController);
export default router;
