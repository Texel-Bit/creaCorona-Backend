//
//verificar token
//
const jwt = require('jsonwebtoken');
let verificaToken = (req, res, next) => {
    let token = req.get('JWT');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                status: false,
                err
            });
        }

        req.user = decode.user;

        next();
    });



};


//verifica admin rol
let verificaAdminRol = (req, res, next) => {
    let token = req.get('JWT');
    var user;
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                status: false,
message:'El usuario debe ser adminsitrador'
            });
        }
         user = decode.user;

    });



    if (user.userRole_iduserRole == 1)  {

        next();
        return;
    } else {
        return res.json({
            status: false,
            message: 'El usuario no es administrador'
        });
    }
};

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                status: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


}


module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}