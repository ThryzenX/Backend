import { Router } from 'express';
import { handleCreateUser } from '../controllers/user.controller';

const router = Router();

router.post("/user",handleCreateUser);

export default router;
