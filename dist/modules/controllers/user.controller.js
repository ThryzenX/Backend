"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserDetailsController = exports.verifyOtpController = exports.signupUserController = void 0;
const user_service_1 = require("../service/user.service");
const otp_service_1 = require("../service/otp.service");
const user_service_2 = require("../service/user.service");
const userDetail_service_1 = require("../service/userDetail.service");
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
        const { userId, otp } = parsed;
        const otpRecord = await (0, otp_service_1.getOtpByEmail)(userId);
        if (!otpRecord) {
            return res.status(404).json({ error: 'OTP not found or already verified' });
        }
        if (otpRecord.otp !== otp) {
            await (0, otp_service_1.incrementOtpAttempts)(userId);
            return res.status(401).json({ error: 'Incorrect OTP' });
        }
        if (otpRecord.expiresAt < new Date()) {
            return res.status(410).json({ error: 'OTP expired' });
        }
        await (0, user_service_2.verifyUserEmail)(userId);
        await (0, otp_service_1.deleteOtp)(userId);
        return res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.verifyOtpController = verifyOtpController;
const addUserDetailsController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const parsed = req.body;
        const result = await (0, userDetail_service_1.addUserDetailsService)({
            userId,
            ...parsed,
        });
        res.status(200).json({
            message: "User details added successfully",
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Something went wrong",
        });
    }
};
exports.addUserDetailsController = addUserDetailsController;
