import express from "express";
// Importa las funciones del controlador de mensajes
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();
// Ruta POST para enviar un mensaje
router.post("/flats/:id", sendMessage);

// Ruta GET para obtener mensajes (se puede filtrar por usuario o flat)
router.get("/flats/:id/sender/:sender", getMessages);

export default router;
