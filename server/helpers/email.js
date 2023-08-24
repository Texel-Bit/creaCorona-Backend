const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_STMP,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmail = (transporter, mailOptions, res) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Email sending failed' });
    } else {
      console.log('Message sent: ', info.messageId);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
};

exports.sendEmailActivationCode = (req, res) => {
  const transporter = createTransporter();
  var mailOptions = {
    from: `"Crea Corona" <${process.env.EMAIL_USERNAME}>`, // Dirección de correo electrónico del remitente
    to: req.customerEmail,
    subject: 'Cotizacion Crea Corona', // Asunto del correo electrónico
  //   text: 'Se contraseña temporal fue asiganda es la siguiente =  ', // Cuerpo del correo electrónico en formato de texto sin formato
    html: `<head>
    <style>
       
        body {
            font-family: 'Roboto', sans-serif;
            color: #000000;
            background-color: #ffffff;
        }
        h1 {
            font-weight: bold;
            color: #00355A;
            margin-bottom: 20px; /* Agrega espacio debajo del título */
        }
        p {
            font-weight: 300;
            text-align: left; /* Justifica el texto a la izquierda */
            text-justify: inter-word; /* Ajusta el espaciado entre palabras */
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .content {
            background-color: #fff;
            padding: 20px;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://experienciacreacorona.texelbit.com/CoronaMail.png" alt="Logo">
    </div>
    <div class="content">
        <h1>¡Hola ${req.customerName} !</h1>
        <p>
        Gracias por atreverte a ser el creador de tu propio diseño con “Crea Corona”, a continuación, encontrarás toda la información de tu piso o pared personalizada creada por medio de nuestra experiencia virtual.
        </p>
        <p>
            Nota: Los productos personalizados no tienen devolución y se sugiere pedir por lo menos un 10% adicional del producto para cubrir los desperdicios en la instalación.
        </p>
    </div>
</body>`, // Cuerpo del correo electrónico en formato HTML
    attachments: [
         
      {   // binary buffer as an attachment
          filename: 'corona.pdf',
          // content:  fs.createReadStream(req.pdfBytes)
          content:  Buffer.from(req.pdfBytes,'utf-8')
        
      }]
  };

  console.log(mailOptions.from);

  sendEmail(transporter, mailOptions, res);
};




