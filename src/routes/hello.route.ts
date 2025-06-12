import express from 'express';
import { getHelloMessage } from '../controllers/hello.controller';

const router = express.Router();

router.get('/hello', getHelloMessage);

export default router;