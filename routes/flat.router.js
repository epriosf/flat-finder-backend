import express from 'express';
import authorizationMiddleware from '../middlewares/authorization.middleware.js';
import { verifyFlatOwnership } from '../middlewares/verifyFlatOwnership.js';
import {
  deleteFlat,
  getFlatById,
  getFlats,
  saveFlat,
  updateFlat,
} from './../controllers/flat.controller.js';
const router = express.Router();
router.get('/', authorizationMiddleware(['admin', 'user']), getFlats);
router.get('/:id', authorizationMiddleware(['admin', 'user']), getFlatById);
router.post('', authorizationMiddleware(['admin', 'user']), saveFlat);
router.put(
  '/:id',
  authorizationMiddleware(['admin', 'user']),
  verifyFlatOwnership,
  updateFlat
);
router.delete(
  '/:id',
  authorizationMiddleware(['admin', 'user']),
  verifyFlatOwnership,
  deleteFlat
);
export default router;
