const nodemailer = require('nodemailer');
// email sender function
exports.sendEmailActivationCode = function(req, res) {
  
    // Configuramos el transporte de correo con las credenciales de correo electrónico del remitente
    var transporter = nodemailer.createTransport({
      host: process.env.stmpemail,
      port: process.env.portemail,
      secure: true, // Use SSL
      auth: {
        user:process.env.email,
        pass:process.env.passemail
      }
    });
  
    // Creamos los detalles del correo electrónico que incluyen la dirección de correo electrónico del destinatario, el asunto, el cuerpo del correo electrónico y un mensaje HTML
    var mailOptions = {
      from: process.env.email, // Dirección de correo electrónico del remitente
      to: req.email, // Dirección de correo electrónico del destinatario
      subject: 'Codigo de activacion', // Asunto del correo electrónico
      text: 'Se contraseña temporal fue asiganda es la siguiente =  ', // Cuerpo del correo electrónico en formato de texto sin formato
      html: `<p>Su contraseña temporas es: <b> ${req.activationCode} </b>  este codigo solo sera valido por las proximas dos horas </p>`, // Cuerpo del correo electrónico en formato HTML
    };
  
    // Enviamos el correo electrónico utilizando el transporte configurado
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        // Si se produce un error al enviar el correo electrónico, devolvemos el error al cliente
        return (error);
      } else {
        // Si se envía el correo electrónico correctamente, enviamos una respuesta HTTP 200 al cliente
        res.status(200).jsonp(req.body);
      }
    });
  };
  

// exports.sendEmailLoginByWallet = function([req,req1], res) {
    
//     const nodemailer = require('nodemailer');

//     var transporter = nodemailer.createTransport({
//         host: process.env.stmpemail,
//         port: process.env.portemail,
//         secure: true, // use SSL
//         auth: {
//             user:process.env.email,
//             pass:process.env.passemail
//         }
//     });
//     // Definimos el email   
//     var mailOptions = {
//         from: process.env.email,
//         to: req.email,
//         subject: 'Codigo de verficacion',
//         text: 'Se contraseña temporal fue asiganda es la sigueitne =  ',
//         html: `<p>su codigo de ingreso es  : <b> ${req1.activationCodeEmail} </b>  este codigo solo sera valido por 15 minutos </p>`,

//     };
//     // Enviamos el email
//     transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {

//             return (error);

//         } else {

//             res.status(200).jsonp(req.body);
//         }

//     });
// };


// Exportamos una función que recibe una solicitud y una respuesta
exports.sendEmailRecoverPassword = function(req, res) {
    
    

    // Creamos un objeto transporter con la información de nuestra cuenta de email
    var transporter = nodemailer.createTransport({
        host: process.env.stmpemail, // Dirección del servidor SMTP
        port: process.env.portemail, // Puerto del servidor SMTP
        secure: true, // Usamos SSL
        auth: {
            user:process.env.email, // Usuario del email que enviará el correo
            pass:process.env.passemail // Contraseña de la cuenta de email
        }
    });

    // Definimos el email que enviaremos
    var mailOptions = {
        from: process.env.email, // Email del remitente
        to: req.email, // Email del destinatario
        subject: 'Contraseña Temporal', // Asunto del correo
        text: 'Se contraseña temporal fue asiganda es la sigueitne =  ', // Cuerpo del correo en texto plano
        html: `<p>su nueva contraseña temporal es : <b> ${req.passwordrecover}  </b> y podra ser usada una unica vez antes del ${req.tempPasswordExpDate}  </p>`, // Cuerpo del correo en formato HTML
    };

    // Enviamos el correo electrónico
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error); // Si hay un error, lo mostramos en la consola
            return (error); // Devolvemos el error como respuesta
        } else {
            res.status(200).jsonp(req.body); // Si el envío del correo fue exitoso, respondemos con un mensaje satisfactorio
        }
    });
};
