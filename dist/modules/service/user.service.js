"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserEmail = exports.signupUserService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mailer_1 = require("../../config/mailer");
const signupUserService = async (data) => {
    const { name, email, password } = data;
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    if (existingUser && existingUser.isVerified) {
        throw new Error('User already exists and is verified');
    }
    if (existingUser && !existingUser.isVerified) {
        await prisma_1.default.otp.update({
            where: {
                email
            },
            data: {
                otp,
                expiresAt
            },
        });
    }
    if (!existingUser) {
        await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                type: 1,
            }
        });
        await prisma_1.default.otp.create({
            data: {
                email,
                otp,
                expiresAt,
            }
        });
    }
    await (0, mailer_1.sendOtpEmail)(email, otp);
};
exports.signupUserService = signupUserService;
const verifyUserEmail = async (email) => {
    return prisma_1.default.user.update({
        where: { email },
        data: { isVerified: true },
    });
};
exports.verifyUserEmail = verifyUserEmail;
