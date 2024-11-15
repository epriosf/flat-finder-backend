// En este archivo debemos tener las configuraciones iniciales de nuestro proyecto
//1.- Creacion del servidor con express para levantarlo en un puerto expecifico.
//2.- Definicion de cada uno del grupo e rutas que van a manejar en el proyecto
// 2.1.- /user, /flats, /messages, /auth
//3.- Llamar a nuestro archivo de conexion a la BDD
//4.- Podemos agregar un middleware global -> cors
//5.- El server se comunica con la capa de ruteo (routes)
import cors from 'cors'
import express from 'express'
import { connectDB } from './db/db.js'
const app = express()

app.use(express.json())
app.use(cors())
connectDB()

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
