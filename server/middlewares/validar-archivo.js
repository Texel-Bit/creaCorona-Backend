const { response } = require("express")


const validarArchivoSubir = (req, res = response, next ) => {


    if (!req.files || Object.keys(req.files).length === 0 ) {
        return res.status(400).json({
            status:false,
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next();

}



const validarArchivoImagen = (req, res = response, next ) => {

    const allowedExtensions = ["jpg", "png", "jpeg"];

    if (!req.files || Object.keys(req.files).length === 0 ) {
        return res.status(400).json({
            status:false,
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    const keys = Object.keys(req.files);
    const file = req.files[keys[0]];

    const nameShort = file.name.split('.');
    const extension = nameShort[nameShort.length - 1];
    if (!allowedExtensions.includes(extension)) {

        return res.status(400).json({
            status:false,
            msg: 'La Extension no es valida'
        });
    }

    next();

}

module.exports = {
    validarArchivoSubir,validarArchivoImagen
}
