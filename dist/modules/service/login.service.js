"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const loginService = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { status: 401, message: "Invalid c . redentials" };
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return { status: 401, message: "Invalid credentials" };
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, type: user.type }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await prisma.token.create({
        data: {
            token,
            userId: user.id,
        },
    });
    return { status: 200, token };
};
exports.loginService = loginService;
