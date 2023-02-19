const userRole = require("../models/userRole");



exports.getAllUserRole = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }

    userRole.getAllUserRole((err, data) => {


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