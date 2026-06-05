import { Router } from 'express';
import { createGroup, getGroups, joinGroup } from '../controllers/group.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, createGroup);
router.post('/:id/join', authenticateJWT, joinGroup);
router.get('/', getGroups);

export default router;
