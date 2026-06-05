import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createStore = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;
        const userId = req.user!.id;

        const store = await prisma.store.create({
            data: {
                name,
                description,
                ownerId: userId,
            }
        });

        res.status(201).json({ success: true, store });
    } catch (error) {
        next(error);
    }
};

export const getStores = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stores = await prisma.store.findMany({ include: { offers: true } });
        res.status(200).json({ success: true, stores });
    } catch (error) {
        next(error);
    }
};

export const getStoreById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const store = await prisma.store.findUnique({
            where: { id },
            include: { offers: true }
        });

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        res.status(200).json({ success: true, store });
    } catch (error) {
        next(error);
    }
};
