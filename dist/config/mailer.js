"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOtpEmail = async (to, otp) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, // in .env
            pass: process.env.MAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject: 'Your OTP Code',
        html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });
};
exports.sendOtpEmail = sendOtpEmail;
