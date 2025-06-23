"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const verifyToken_1 = require("../validators/verifyToken");
const router = express_1.default.Router();
router.post('/signup-user1', user_controller_1.signupUserController);
router.post('/verify-otp', user_controller_1.verifyOtpController);
router.post('/login', auth_controller_1.loginController);
router.post('/add-user-detail', verifyToken_1.verifyToken, user_controller_1.addUserDetailsController);
exports.default = router;
