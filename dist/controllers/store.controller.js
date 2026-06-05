"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreById = exports.getStores = exports.createStore = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createStore = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;
        const store = await prisma_1.default.store.create({
            data: {
                name,
                description,
                ownerId: userId,
            }
        });
        res.status(201).json({ success: true, store });
    }
    catch (error) {
        next(error);
    }
};
exports.createStore = createStore;
const getStores = async (req, res, next) => {
    try {
        const stores = await prisma_1.default.store.findMany({ include: { offers: true } });
        res.status(200).json({ success: true, stores });
    }
    catch (error) {
        next(error);
    }
};
exports.getStores = getStores;
const getStoreById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const store = await prisma_1.default.store.findUnique({
            where: { id },
            include: { offers: true }
        });
        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }
        res.status(200).json({ success: true, store });
    }
    catch (error) {
        next(error);
    }
};
exports.getStoreById = getStoreById;
