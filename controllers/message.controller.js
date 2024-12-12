import {
  getMessagesService,
  getUserMessageService,
  saveMessageService,
} from '../services/message.service.js';
import logger from '../utils/logger.js';
// 1. Ruta POST para enviar un mensaje add message
//router.post("/flats/:id", addMessage);
////////// Función para enviar un mensaje
const saveMessage = async (req, res, next) => {
  try {
    // Extraer los datos del mensaje de la solicitud
    const { sender, content } = req.body;
    const flat = req.params.id;

    // Validar los campos requeridos (considerar agregar una biblioteca de validación)
    if (!sender || !flat || !content) {
      logger.warning('Faltan campos obligatorios: sender, flat, contenido', {
        sender,
        flat,
        content,
      });
      return res.status(400).json({
        error: 'Faltan campos obligatorios: sender, flat, contenido',
      });
    }

    // Crear un nuevo objeto de Mensaje
    const newMessage = await saveMessageService(sender, flat, content);
    logger.info(`Message created successfully with ID: ${newMessage._id}`);
    res
      .status(201)
      .json({ message: 'Message created successfully', data: newMessage });
  } catch (error) {
    logger.error('Error sending the message:', {
      error: error.message,
    });
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

//////// 2. Ruta GET para obtener todos los mensajes de un flat
//router.get("/flats/:id/messages", getAllMessages);
/////// Función para obtener todos los mensajes de un flat
const getAllMessages = async (req, res, next) => {
  try {
    const { id } = req.params; // Obtiene el ID del piso de los parámetros de la URL

    // Busca todos los mensajes que pertenecen al piso especificado
    const messages = await getMessagesService(id);

    res.status(200).json(messages);
  } catch (error) {
    logger.error('Error al obtener los mensajes:', {
      error: error.message,
    });
    res.status(500).json({ message: 'Error al obtener los mensajes' });
    next(error);
  }
};

// 3. Ruta GET para obtener mensajes de un usuario
//router.get("/flats/:id/sender/:sender", getUserMessages);
// Función para obtener mensajes de un usuario
const getUserMessages = async (req, res, next) => {
  try {
    // Definir opciones de filtro basadas en los parámetros de la consulta
    const filters = {};
    if (req.params.sender) {
      filters.sender = req.params.sender;
    }
    if (req.query.flatId) {
      filters.flat = req.query.flatId;
    }
    if (req.query.startDate && req.query.endDate) {
      filters.sentAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Obtener los mensajes de la base de datos
    const messages = await getUserMessageService(filters);

    // Responder con los mensajes recuperados
    res.status(200).json(messages);
  } catch (error) {
    logger.error('Error al obtener los mensajes', {
      error: error.message,
    });
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

// Exportar las funciones para su uso en el router
export { getAllMessages, getUserMessages, saveMessage };
