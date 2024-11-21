import express from 'express';
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
router.put('/:id', updateFlat);
router.delete('/:id', deleteFlat);
export default router;
