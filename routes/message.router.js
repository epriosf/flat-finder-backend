import express from "express";
// Importa las funciones del controlador de mensajes
import {
  addMessage,
  getUserMessages,
  getAllMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

// 1. Ruta POST para enviar un mensaje add message
router.post("/flats/:id", addMessage);

// 2. Ruta GET para obtener todos los mensajes de un flat
router.get("/flats/:id/messages", getAllMessages);

// 3. Ruta GET para obtener mensajes de un usuario
router.get("/flats/:id/sender/:sender", getUserMessages);

export default router;
