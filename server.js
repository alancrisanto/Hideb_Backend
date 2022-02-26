import express, {json} from "express";
import mongoose from "mongoose";
import sgMail from '@sendgrid/mail'

import { usuarioRouter } from "./src/routes/usuario.routes";


const app = express();

app.use(json());

const PORT = process.env.PORT ?? 3000;


app.use(usuarioRouter)

app.listen(PORT, async () => {
    console.log("Servidor corriendo en el puerto ", PORT)

    try {
        const respuesta = await mongoose.connect(process.env.MONGODB);
        console.log("Conexion a la BD exitosa ✔")
    } catch (error) {
        console.log(error);
    }
});

