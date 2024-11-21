import express from 'express'
import { getFlats } from './../controllers/flat.controller.js'
const router = express.Router()
router.get('/', getFlats)
// router.get('', getFlatById)
// router.post('', saveFlat)
// router.put('', updateFlat)
// router.delete('/:id', deleteFlat)
export default router
