import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USER_MONGO_DB_ATLAS}:${process.env.PASSWORD_MONGO_DB_ATLAS}@cluster0.gca1u.mongodb.net/flatfinder-db?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
  }
};
