const nodemailer = require('nodemailer');
// email sender function
exports.sendEmailActivationCode = function(req, res) {
    
    console.log(req.email);
    const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        host: process.env.stmpemail,
        port: process.env.portemail,
        secure: true, // use SSL
        auth: {
            user:process.env.email,
            pass:process.env.passemail
        }
    });
    // Definimos el email   
    var mailOptions = {
        from: process.env.email,
        to: req.email,
        subject: 'Codigo de activacion',
        text: 'Se contraseña temporal fue asiganda es la siguiente =  ',
        html: `<p>Su contraseña temporas es: <b> ${req.activationCode} </b>  este codigo solo sera valido por las proximas dos horas </p>`,

    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {

            return (error);

        } else {

            res.status(200).jsonp(req.body);
        }

    });
};

exports.sendEmailLoginByWallet = function([req,req1], res) {
    
    const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        host: process.env.stmpemail,
        port: process.env.portemail,
        secure: true, // use SSL
        auth: {
            user:process.env.email,
            pass:process.env.passemail
        }
    });
    // Definimos el email   
    var mailOptions = {
        from: process.env.email,
        to: req.email,
        subject: 'Codigo de verficacion',
        text: 'Se contraseña temporal fue asiganda es la sigueitne =  ',
        html: `<p>su codigo de ingreso es  : <b> ${req1.activationCodeEmail} </b>  este codigo solo sera valido por 15 minutos </p>`,

    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {

            return (error);

        } else {

            res.status(200).jsonp(req.body);
        }

    });
};


exports.sendEmailRecoverPassword = function(req, res) {
    
    const nodemailer = require('nodemailer');


    console.log(req);

    var transporter = nodemailer.createTransport({
        host: process.env.stmpemail,
        port: process.env.portemail,
        secure: true, // use SSL
        auth: {
            user:process.env.email,
            pass:process.env.passemail
        }
    });
    // Definimos el email   
    var mailOptions = {
        from: process.env.email,
        to: req.email,
        subject: 'Contraseña Temporal',
        text: 'Se contraseña temporal fue asiganda es la sigueitne =  ',
        html: `<p>su nueva contraseña temporal es : <b> ${req.passwordrecover}  </b> y podra ser usada una unica vez antes del ${req.tempPasswordExpDate}  </p>`,

    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {

            console.log(error);
            return (error);

        } else {

            res.status(200).jsonp(req.body);
        }

    });
};