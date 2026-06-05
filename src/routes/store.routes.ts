import { Router } from 'express';
import { createStore, getStores, getStoreById } from '../controllers/store.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

import { authorizeRoles } from '../middlewares/role.middleware';

router.post(
    '/',
    authenticateJWT,
    authorizeRoles('STORE_OWNER', 'ADMIN'),
    createStore
);
router.get('/', getStores);
router.get('/:id', getStoreById);

export default router;
