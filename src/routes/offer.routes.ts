import { Router } from 'express';
import { createOffer, getOffers } from '../controllers/offer.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, createOffer);
router.get('/', getOffers);

export default router;
