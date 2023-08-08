
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uuid = require('uuid');

var fs = require('fs');


const subirArchivo = (files, extensionesValidas = ['xlsx'], carpeta = '') => {
    return new Promise((resolve, reject) => {

        const file = files.files;

        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
        file.mv(uploadPath, (err) => {
            if (err) {

                resolve(err);
            }

            resolve(uploadPath);
        });

    });

}

const subirArchivoImagen = (file, carpeta = '') => {
    return new Promise((resolve, reject) => {



        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        // Validar la extension
 
 


        const nombreTemp = uuidv4() + '.' + extension;




        const uploadPath = path.join(carpeta, nombreTemp);
        file.mv(uploadPath, (err) => {

            if (err) {

                resolve(err);
            }

            resolve(uploadPath);
        });

    });

}

const CastBase64ToImage = (base64Data, carpeta = '') => {
    return new Promise((resolve, reject) => {
        // Split the base64 string to remove the MIME type
        const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            reject(new Error('Invalid input string format'));
            return;
        }

        const mimeType = matches[1];
        const rawData = matches[2];
        const extension = mimeType.split('/')[1]; // Expecting a MIME type like 'image/png' or 'image/jpeg'

        // Convert the base64 string to a buffer
        const buffer = Buffer.from(rawData, 'base64');

        // Generate a unique filename for the file
        const nombreTemp = uuidv4() + '.' + extension;

        // Build the full path for the file
        const uploadPath = path.join(carpeta, nombreTemp);

        // Write the file to the server
        fs.writeFile(uploadPath, buffer, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(uploadPath);
        });
    });
}

const subirArchivoThumbnail = (files, extensionesValidas = ['jpg', 'png', 'jpeg','svg'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const file = files.thumbnail;
        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
        }

        const nombreTemp = 'poster' + '.' + extension;
        const uploadPath = path.join(carpeta, nombreTemp);

        file.mv(uploadPath, (err) => {
            if (err) {
                //console.log(err, "en el errro");
                resolve(err);
            } else {
                const StatusGoogle = subirFileGoogle(uploadPath, `poster.${extension}`);
                if (StatusGoogle == "error") {
                    resolve(err);

                } else {
                    resolve(StatusGoogle);

                }

            }

        });

    });

}
const subirArchivoglb = (files, extensionesValidas = ['glb'], carpeta) => {
    return new Promise((resolve, reject) => {
console.log(carpeta,"carpeta");
        const file = files.glbModelUrl;

        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
        }

        const nombreTemp = 'android' + '.' + extension;
        const uploadPath = path.join(carpeta, nombreTemp);
        console.log(uploadPath,"esta");

        file.mv(uploadPath, (err) => {
            if (err) {

                resolve("error");
            } else {
                const StatusGoogle = subirFileGoogle(uploadPath, `android.${extension}`);
                if (StatusGoogle == "error") {
                    resolve(err);

                } else {
                    resolve(StatusGoogle);

                }

            }

        });

    });


}


const subirArchivousdz = async (files, extensionesValidas = ['usdz'], carpeta = '') => {
    return new Promise((resolve, reject) => {

        const file = files.usdzModelUrl;

        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
        }

        const nombreTemp = 'ios' + '.' + extension;
        const uploadPath = path.join(carpeta, nombreTemp);


        file.mv(uploadPath, async (err) => {
            if (err) {

                resolve(err);
            } else {
                const StatusGoogle = await subirFileGoogle(uploadPath, `ios.${extension}`);
                if (StatusGoogle == "error") {
                    resolve(err);

                } else {
                    //console.log(StatusGoogle, "statusgoogle");

                    resolve(StatusGoogle);

                }

            }

        });

    });


}
const subirArchivoRevision = async (files, extensionesValidas = ['jpg','png,','jpeg'], carpeta = '') => {

    console.log("ingreso 188");
    return new Promise((resolve, reject) => {

        const file = files.imageUrl;

        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        // Validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida - ${extensionesValidas}`);
        }
const valoraleatorio=uuid.v4(); 
        const nombreTemp = valoraleatorio + '.' + extension;
        const uploadPath = path.join(carpeta, nombreTemp);


        file.mv(uploadPath, async (err) => {
            if (err) {
                resolve(err);
            } else {
                const StatusGoogle = await subirFileGoogle(uploadPath, `${valoraleatorio}.${extension}`);
                if (StatusGoogle == "error") {
                    resolve(err);
                    console.log(err,"210");
                    console.log(StatusGoogle, "statusgoogle209");


                } else {
                    console.log(StatusGoogle, "statusgoogle");

                    resolve(StatusGoogle);

                }

            }

        });

    });


}


async function subirFileGoogle(file, nameFile) {
    const filePath = file;
     let arr = filePath.split('/');
 
     arr = arr.slice(1, arr.length - 1);
     arr = arr.join('/')
 
     // The new ID for your GCS file
     var destFileName = arr + "/" + nameFile
 console.log(filePath,"filePath");
     async function uploadFile() {
         await storage.bucket(bucketName).upload(filePath, {
             destination: destFileName,
         });
 
         // //console.log(`${filePath} uploaded to ${bucketName}`);
     }
 
     await uploadFile().then(function (data) {
         console.log(destFileName, "updLOAD");
     })
 
         .catch(function (error) {
             console.log(error);
         });
         destFileName = destFileName.split('/');
 
         destFileName = destFileName.slice(1,destFileName.length);
         destFileName = destFileName.join('/')
 
         return nameFile;
 
 
 }
module.exports = {
    subirArchivo,
    subirArchivoglb,
    subirArchivousdz,
    subirArchivoThumbnail,
    subirArchivoRevision,
    subirArchivoImagen,
    CastBase64ToImage
}
