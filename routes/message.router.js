import express from 'express';
// Importa las funciones del controlador de mensajes
import {
  getAllMessages,
  getUserMessages,
  saveMessage,
} from '../controllers/message.controller.js';
import { verifyFlatOwnership } from '../middlewares/verifyFlatOwnership.js';
import { verifySender } from '../middlewares/verifySender.middleware.js';

const router = express.Router();

// 1. Ruta POST para enviar un mensaje add message
router.post('/flats/:id', saveMessage);

// 2. Ruta GET para obtener todos los mensajes de un flat
router.get('/flats/:id/messages', verifyFlatOwnership, getAllMessages);

// 3. Ruta GET para obtener mensajes de un usuario
router.get('/flats/:id/sender/:sender', verifySender, getUserMessages);

export default router;
