import { Router } from 'express';
import {
    getUserContributions,
    getUserCoupons,
    redeemCoupon
} from '../controllers/contribution.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, getUserContributions);
router.get('/coupons', authenticateJWT, getUserCoupons);
router.post('/redeem', authenticateJWT, redeemCoupon);

export default router;