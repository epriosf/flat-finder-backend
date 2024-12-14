// En este archivo debemos tener las configuraciones iniciales de nuestro proyecto
//1.- Creacion del servidor con express para levantarlo en un puerto expecifico.
//2.- Definicion de cada uno del grupo e rutas que van a manejar en el proyecto
// 2.1.- /user, /flats, /messages, /auth
//3.- Llamar a nuestro archivo de conexion a la BDD
//4.- Podemos agregar un middleware global -> cors
//5.- El server se comunica con la capa de ruteo (routes)
import cors from 'cors';
import express from 'express';
import { connectDB } from './db/db.js';
import authenticationMiddleware from './middlewares/authentication.middleware.js';
import errorHandler from './middlewares/errorHandler.js';
import loginRateLimiter from './middlewares/rateLimit.middleware.js';
import authRoutes from './routes/auth.router.js';
import flatRoutes from './routes/flat.router.js';
import logsRoutes from './routes/logs.router.js';
import messagesRoutes from './routes/message.router.js';
import userRoutes from './routes/user.router.js';
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend's origin
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));
//app.use(cors());
app.use(express.json());
connectDB();

// Root route for testing
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/flats', authenticationMiddleware, flatRoutes);
app.use('/messages', authenticationMiddleware, messagesRoutes);
app.use('/users', authenticationMiddleware, userRoutes);
app.use('/auth', loginRateLimiter, authRoutes);
app.use('/logs', logsRoutes);

//Middleware for error handling
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
