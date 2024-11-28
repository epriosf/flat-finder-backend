import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import crypto from "crypto";

//definir el schema de la base de datos para la coleccion de usuarios
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  favouriteFlats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat'
    }
  ],
  deleted: {
    type: Date
  },
  //El proyecto pide un borrado fisico, pero mejor es hacer un borrado logico

  role: {
    type: String,
    enum: ["admin", "user", "author"],
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date, 
  deletedAt: {
    type: Date,
    default: null,
  },
});

userSchema.pre("save", async function (next) {
  const user = this; //this -> es el objeto que estamos guardando en BDD

  if (user.isModified("password")) {
    try {
      
      const salt = await bcrypt.genSalt(10);

      const hash = await bcrypt.hash(user.password, salt);

      user.password = hash;

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

userSchema.post("find", function (docs, next) {
  docs.forEach((doc) => {
    doc.password = undefined;
  });
  next();
});

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generatePasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 3600000;

  return resetToken;
};

export const User = mongoose.model('User', userSchema)
