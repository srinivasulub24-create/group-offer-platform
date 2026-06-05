import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createOffer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, requiredGroupSize, discountValue, storeId } = req.body;

        // Ensure the store belongs to the user or admin, simplified here
        const store = await prisma.store.findUnique({ where: { id: storeId } });
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

        const offer = await prisma.offer.create({
            data: {
                title,
                description,
                requiredGroupSize,
                discountValue,
                storeId,
            }
        });

        res.status(201).json({ success: true, offer });
    } catch (error) {
        next(error);
    }
};

export const getOffers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const offers = await prisma.offer.findMany({ include: { store: true } });
        res.status(200).json({ success: true, offers });
    } catch (error) {
        next(error);
    }
};
