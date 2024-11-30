import { Message } from "../models/message.model.js";

// Función para enviar un mensaje
const sendMessage = async (req, res, next) => {
  try {
    // Extraer los datos del mensaje de la solicitud
    const { sender, content } = req.body;
    const flat = req.params.id;

    // Validar los campos requeridos (considerar agregar una biblioteca de validación)
    if (!sender || !flat || !content) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: sender, flat, content",
      });
    }

    // Crear un nuevo objeto de Mensaje
    const newMessage = new Message({ sender, flat, content });

    // Guardar el mensaje en la base de datos
    await newMessage.save();

    // Responder con un mensaje de éxito y los datos del mensaje guardado
    res
      .status(201)
      .json({ message: "Mensaje enviado exitosamente", data: newMessage });
  } catch (error) {
    // Mensaje error
    console.error("Error al enviar el mensaje:", error.message);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

// Función para obtener mensajes
const getMessages = async (req, res, next) => {
  try {
    // Definir opciones de filtro basadas en los parámetros de la consulta
    const filters = {};
    if (req.query.senderId) {
      filters.senderId = req.query.senderId;
    }
    if (req.query.flatId) {
      filters.flatId = req.query.flatId;
    }

    // Obtener los mensajes de la base de datos
    const messages = await Message.find(filters).populate("flat", "sender");

    // Responder con los mensajes recuperados
    res.status(200).json(messages);
  } catch (error) {
    // Manejar errores de forma elegante
    console.error("Error al obtener los mensajes:", error.message);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

// Exportar las funciones para su uso en el router
export { sendMessage, getMessages };
