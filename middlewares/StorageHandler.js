const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AnswerManager = require('./AnswerManager');

class StorageHandler {
    static baseDirectory = './public/uploads';

    static createMulterStorage(subFolder) {
        const uploadFolderPath = path.join(this.baseDirectory, subFolder);
        if (!fs.existsSync(uploadFolderPath)) {
            fs.mkdirSync(uploadFolderPath, { recursive: true });
        }
        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadFolderPath);
            },
            filename: (req, file, cb) => {
                cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
            }
        });
    }

    static saveBase64Image(base64Image, imageName, subFolder) {
        return new Promise((resolve, reject) => {
            try {
                const uploadFolderPath = path.join(this.baseDirectory, subFolder);
                if (!fs.existsSync(uploadFolderPath)) {
                    fs.mkdirSync(uploadFolderPath, { recursive: true });
                }
                const imageBuffer = Buffer.from(base64Image.split(';base64,').pop(), 'base64');
                const imagePath = path.join(uploadFolderPath, imageName);
                fs.writeFileSync(imagePath, imageBuffer, { encoding: null });
                resolve(path.join('uploads', subFolder, imageName));
            } catch (error) {
                reject(error);
            }
        });
    }

    static getMulterMiddleware(subFolder) {
        const storage = this.createMulterStorage(subFolder);
        return multer({ storage: storage }).single('image');
    }

    static processImageFields = (fieldNames) => {
        return async (req, res, next) => {
            try {

                console.log(req.body.image.startsWith('http'))

                if(req.body.image.startsWith('http')) {

                    next();
                    return

                      
                }

                let base64Image = null;
                if (req.files) {
                    const imageBuffer = req.files.image[0].buffer;
                    base64Image = req.body.image ? req.body.image : imageBuffer.toString('base64');
                } else if (req.body.image) {
                    base64Image = req.body.image;
                }
    
                // Dynamically add the base64 image to req.body using the specified field name
                for (const fieldName of fieldNames) {
                    req.body[fieldName] = base64Image;
                }
    
                // Continue to the next middleware or route handler
                next();
            } catch (error) {
                // Handle errors and call next() with the error
                next(error);
            }
        };
    };



    static async GetImage(image,imageName,uploadFolderPath) {
       
        if(image)
        {

            console.log(image)
            if(image.startsWith('http')) {
         
                console.log(image)
                return null;     
            }

              const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              let extension = 'png'; // Default extension in case the regex does not match
          
              if (matches && matches.length === 3) {
                  const mimeType = matches[1];
                  // Extract the extension from the MIME type (e.g., 'image/png' => 'png')
                  extension = mimeType.split('/')[1];
              }
          

           
              imageName = imageName.replace(/[: ]/g, '-') + '.' + extension;
              
              var timestamp = new Date().getTime(); 
              imageName = imageName.replace('.' + extension, '-' + timestamp + '.' + extension);

              image = await StorageHandler.saveBase64Image(image, imageName, uploadFolderPath);
              
              console.log("Image converted ",image)
              return image;
          }

    }
}

module.exports = StorageHandler;
