"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOtp = exports.incrementOtpAttempts = exports.getOtpByEmail = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getOtpByEmail = async (userId) => {
    return prisma_1.default.otp.findUnique({
        where: { userId },
    });
};
exports.getOtpByEmail = getOtpByEmail;
const incrementOtpAttempts = async (userId) => {
    return prisma_1.default.otp.update({
        where: { userId },
        data: {
            attempts: { increment: 1 },
        },
    });
};
exports.incrementOtpAttempts = incrementOtpAttempts;
const deleteOtp = async (userId) => {
    return prisma_1.default.otp.delete({
        where: { userId },
    });
};
exports.deleteOtp = deleteOtp;
