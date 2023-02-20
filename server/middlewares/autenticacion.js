
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



// Se define una función middleware para verificar el rol de administrador
const verificaAdminRol = (req, res, next) => {
    const token = req.get('JWT');
    
    // Se verifica el token
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                status: false,
                message: 'Token no válido'
            });
        }
        
        const user = decode.user;

        // Se verifica el rol del usuario
        if (user.userRole_iduserRole == 1) {
            next();
        } else {
            return res.json({
                status: false,
                message: 'El usuario no es administrador'
            });
        }
    });
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