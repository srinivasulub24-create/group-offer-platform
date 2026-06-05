import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createGroup = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { offerId } = req.body;

        const offer = await prisma.offer.findUnique({
            where: { id: offerId }
        });

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        // Find existing OPEN group
        let group = await prisma.group.findFirst({
            where: {
                offerId,
                status: 'OPEN'
            },
            include: {
                contributions: true
            }
        });

        // If no OPEN group exists → create one
        if (!group) {
            group = await prisma.group.create({
                data: {
                    offerId,
                    status: 'OPEN',
                    currentSize: 1
                },
                include: {
                    contributions: true
                }
            });

            // Auto join creator
            await prisma.contribution.create({
                data: {
                    groupId: group.id,
                    userId: req.user!.id,
                    status: 'COMPLETED'
                }
            });

            return res.status(201).json({
                success: true,
                message: 'New group created',
                group
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Open group found',
            group
        });
    } catch (error) {
        next(error);
    }
};
export const joinGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const userId = req.user!.id;

        const group = await prisma.group.findUnique({ where: { id }, include: { offer: true, contributions: true } });
        if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

        if (group.status !== 'OPEN') {
            return res.status(400).json({ success: false, message: 'Group is no longer open' });
        }

        const alreadyJoined = group.contributions.some((c: any) => c.userId === userId);
        if (alreadyJoined) {
            return res.status(400).json({ success: false, message: 'User already in group' });
        }

        await prisma.contribution.create({
            data: {
                groupId: id,
                userId,
                status: 'COMPLETED',
            }
        });

        const currentSize = group.currentSize + 1;
        let status: any = group.status;

      if (currentSize >= (group as any).offer.requiredGroupSize) {
    status = 'UNLOCKED';

    const contributions = await prisma.contribution.findMany({
        where: { groupId: id }
    });

    for (const contribution of contributions) {
        const existingCoupon = await prisma.coupon.findFirst({
            where: {
                userId: contribution.userId,
                offerId: group.offerId
            }
        });

        if (!existingCoupon) {
            await prisma.coupon.create({
                data: {
                    code: `OFFER-${Math.random()
                        .toString(36)
                        .substring(2, 8)
                        .toUpperCase()}`,
                    userId: contribution.userId,
                    offerId: group.offerId,
                    expiresAt: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    )
                }
            });
        }
    }
}

        const updatedGroup = await prisma.group.update({
            where: { id },
            data: { currentSize, status }
        });

        res.status(200).json({ success: true, group: updatedGroup });
    } catch (error) {
        next(error);
    }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groups = await prisma.group.findMany({ include: { offer: true, contributions: true } });
        res.status(200).json({ success: true, groups });
    } catch (error) {
        next(error);
    }
};
