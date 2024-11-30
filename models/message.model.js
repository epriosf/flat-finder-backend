import mongoose from "mongoose";
// define la estructura de los documentos que se almacenarán en una colección de MongoDB
//definimos los campos que tendrá cada documento de mensaje:
const messageSchema = new mongoose.Schema({
  //Contenido del mensaje
  content: {
    type: String,
    required: [true, "El contenido del mensaje es obligatorio"],
    trim: true,
  },
  //Hace referencia a otro documento en la colección "User".Debe estar atado a un usuario
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El remitente del mensaje es obligatorio"],
  },
  // Hace referencia al destinatario del mensaje.
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
    required: [true, "El destinatario del mensaje es obligatorio"],
  },
  //Almacena la fecha y hora en que se envió el mensaje.
  sentAt: {
    type: Date,
    default: Date.now,
  },
  // Tipo de mensaje texto
  type: {
    type: String,
    enum: ["text"],
  },

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        flat: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Flat",
        },
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const Message = mongoose.model("Message", messageSchema);
