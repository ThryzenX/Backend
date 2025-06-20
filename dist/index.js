"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./modules/routes/user.route")); // 👈 notice: NOT the controller!
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', user_route_1.default); // ✅ pass the Router, not the controller
app.listen(3000, () => {
    console.log(`✅ Server running`);
});
