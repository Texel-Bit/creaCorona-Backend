const Rol = require("../models/rol");
const randompassword = require('secure-random-password');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const date = require('date-and-time');

exports.getAllRoles = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }

    Rol.getAllRoles((err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "no se pudo consultar"
            });
        else {
            // let token = jwt.sign({
            //     user: user,
            // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            // res.setHeader('token', token);
            res.json({
                status: true,
                data
            });
        }

    });


};


exports.getAllModule = (req, res) => {

    let token = req.get('JWT');
    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            res.status(500).send({
                message: err
            });

        }

   
        idrol = decode.user.rol_idrol;

    });




    Rol.getAllModule(idrol, (err, data) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
        } else {

            res.json({
                status: true,
                data

            });
        }

    });


};

