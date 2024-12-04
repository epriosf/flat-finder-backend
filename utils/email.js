import nodemailer from 'nodemailer';
//En las options vamos a recibir el email a donde vamos a enviar el correo
//Vamos a recibir el asunto del correo
//Vamos a recibir el mensaje del correo
//Options es un objeto que tiene las propiedades email, subject, message
const sendEmail = async (options) => {
  //vamos a crear la integracion con el servicio de mailtrap usando nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAITRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  //Vamos a armar las opciones de envio de nuestro correo
  const mailOptions = {
    from: '"FlatFinder Backend" <no-reply@demomailtrap.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
