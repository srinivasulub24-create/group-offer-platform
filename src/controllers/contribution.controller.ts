import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getUserContributions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const contributions = await prisma.contribution.findMany({
            where: { userId },
            include: { group: true }
        });

        res.status(200).json({ success: true, contributions });
    } catch (error) {
        next(error);
    }
};
export const getUserCoupons = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const coupons = await prisma.coupon.findMany({
      where: { userId },
      include: { offer: true }
    });

    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    next(error);
  }
};
export const redeemCoupon = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.id;
        const { code } = req.body;

        const coupon = await prisma.coupon.findFirst({
            where: {
                code,
                userId
            }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        if (coupon.isUsed) {
            return res.status(400).json({
                success: false,
                message: 'Coupon already used'
            });
        }

        if (new Date() > coupon.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'Coupon expired'
            });
        }

        const updatedCoupon = await prisma.coupon.update({
            where: { id: coupon.id },
            data: {
                isUsed: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Coupon redeemed successfully',
            coupon: updatedCoupon
        });
    } catch (error) {
        next(error);
    }
};