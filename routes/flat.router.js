import express from 'express';
import { verifyFlatOwnership } from '../middlewares/verifyFlatOwnership.js';
import {
  deleteFlat,
  getFlatById,
  getFlats,
  saveFlat,
  updateFlat,
} from './../controllers/flat.controller.js';
const router = express.Router();
router.get('/', getFlats);
router.get('/:id', getFlatById);
router.post('', saveFlat);
router.put('/:id', verifyFlatOwnership, updateFlat);
router.delete('/:id', verifyFlatOwnership, deleteFlat);
export default router;
