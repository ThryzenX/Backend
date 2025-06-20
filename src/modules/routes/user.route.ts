import { Router } from 'express';
import { signupUserController,verifyOtpController } from '../controllers/user.controller';
import { loginController } from '../controllers/auth.controller';
const router = Router();
router.post('/signup-user1', signupUserController);
router.post('/verify-otp', verifyOtpController);
router.post('/login',loginController);
export default router;
