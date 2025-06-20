"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpController = exports.signupUserController = void 0;
const user_service_1 = require("../service/user.service");
const otp_service_1 = require("../service/otp.service");
const user_service_2 = require("../service/user.service");
const signupUserController = async (req, res) => {
    const userInput = req.body;
    try {
        const result = await (0, user_service_1.signupUserService)(userInput);
        res.status(201).json(result);
    }
    catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
};
exports.signupUserController = signupUserController;
const verifyOtpController = async (req, res) => {
    try {
        const parsed = req.body;
        // if (!parsed.success) {
        //   return res.status(400).json({ error: 'Invalid input' });
        // }
        const { email, otp } = parsed;
        const otpRecord = await (0, otp_service_1.getOtpByEmail)(email);
        if (!otpRecord) {
            return res.status(404).json({ error: 'OTP not found or already verified' });
        }
        if (otpRecord.otp !== otp) {
            await (0, otp_service_1.incrementOtpAttempts)(email);
            return res.status(401).json({ error: 'Incorrect OTP' });
        }
        if (otpRecord.expiresAt < new Date()) {
            return res.status(410).json({ error: 'OTP expired' });
        }
        await (0, user_service_2.verifyUserEmail)(email);
        await (0, otp_service_1.deleteOtp)(email);
        return res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.verifyOtpController = verifyOtpController;
