"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserContributions = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUserContributions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contributions = await prisma_1.default.contribution.findMany({
            where: { userId },
            include: { group: true }
        });
        res.status(200).json({ success: true, contributions });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserContributions = getUserContributions;
