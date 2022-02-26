import { Usuario } from "../models/usuario.model.js";
import { hashSync } from "bcrypt";
import cryptojs from "crypto-js";
import sgMail from '@sendgrid/mail';

export class UsuarioService {
    static async registro(data) {
        try {
            const password = hashSync(data.password, 10);

            const usuarioCreado = await Usuario.create({...data, password});
            return usuarioCreado;
        } catch (error) {
            return {
                message: "No se pudo crear usuario",
                content: error.message,
            }
        }
    }

    static async recuperarPassword(correo){
        const usuarioEncontrado = await Usuario.findOne({usuarioCorreo: correo});

        if (usuarioEncontrado){
            const token = cryptojs.AES.encrypt(
                JSON.stringify({
                    correo: usuarioEncontrado.usuarioCorreo,
                    nombre: usuarioEncontrado.usuarioNombre,
                }),
                process.env.SECRET_CRYPT_PASSWORD
            ).toString();

            console.log(token);

            const recuperarContraseña = await sgMail.send({
                from: "alanvcrisanto@gmail.com",
                text: "Recuperar tu constraseña",
                subject: "Restaura tu contraseña",
                to: usuarioEncontrado.usuarioCorreo,
                html: `
                    <h2>Hola ${usuarioEncontrado.usuarioNombre}, al parecer has olvidado la contraseña</h2>
                    <p>Ingresa al siguiente link para restaurar tu contraseña</p><code>http://localhost:3000?token${token}</code>
                `
            });

            console.log(recuperarContraseña);
        }

        console.log(usuarioEncontrado)
    }

    static async resetPassword(hash, password){
        const tokenDecodificada = JSON.parse(
            cryptojs.AES.decrypt(hash, process.env.SECRET_CRYPT_PASSWORD).toString(
                cryptojs.enc.Utf8
            )
        );

        console.log(tokenDecodificada);
    }
}

