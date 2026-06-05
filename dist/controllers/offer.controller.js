"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffers = exports.createOffer = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createOffer = async (req, res, next) => {
    try {
        const { title, description, requiredGroupSize, discountValue, storeId } = req.body;
        // Ensure the store belongs to the user or admin, simplified here
        const store = await prisma_1.default.store.findUnique({ where: { id: storeId } });
        if (!store)
            return res.status(404).json({ success: false, message: 'Store not found' });
        const offer = await prisma_1.default.offer.create({
            data: {
                title,
                description,
                requiredGroupSize,
                discountValue,
                storeId,
            }
        });
        res.status(201).json({ success: true, offer });
    }
    catch (error) {
        next(error);
    }
};
exports.createOffer = createOffer;
const getOffers = async (req, res, next) => {
    try {
        const offers = await prisma_1.default.offer.findMany({ include: { store: true } });
        res.status(200).json({ success: true, offers });
    }
    catch (error) {
        next(error);
    }
};
exports.getOffers = getOffers;
