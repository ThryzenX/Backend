"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const login_service_1 = require("../service/login.service");
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, login_service_1.loginService)(email, password);
        return res.status(result.status).json(result.status === 200
            ? { token: result.token }
            : { message: result.message });
    }
    catch (err) {
        return res.status(400).json({ error: "Invalid input" });
    }
};
exports.loginController = loginController;
