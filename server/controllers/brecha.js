const {
    createBrecha,updateBrecha,getAllBrecha
  
  } = require("../models/brecha");
  

  const { subirArchivoImagen } = require("../helpers/subirarchivos");




exports.createBrecha = async(req, res) => {

    try {
    const { brechaName} = req.body
    if (!brechaName ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }


    const image = await subirArchivoImagen(req.files, "uploads/Brecha");
    // Manejo de errores de subirArchivoImagen


    if (!image) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
  const  data= {
    brechaName,
    brechaColorPath:image,
    
      }

      const createdBrecha = await createBrecha(data);

      
      res.json({
        status: true,
        data: createdBrecha,
      });
    } catch (error) {
  
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No pudo ser creada la brecha',
        },
      });
    }
  };


  exports.updateBrecha =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const {idbrecha, brechaName, brechaColorPath} = req.body;

    
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
    if (req.files) {
      const image = await subirArchivoImagen(
        req.files,
        ["jpg", "png", "jpeg"],
        "uploads/Company"
      );

      const brecha = await getAllBrecha(data);

   
      const filePath = path.join(process.cwd(), brecha.brechaColorPath);

      
      (data.brechaColorPath = image), fs.unlinkSync(filePath);
    }

      const  data= {
        idbrecha:+idbrecha,

        brechaName,
        brechaColorPath,
        
          }


  
    updateBrecha(data, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          error: err,
        });
      }
      
  
  
      res.json({
        status: true,
        user: result,
      });
    });
  };
  

  exports.getAllBrecha = async (req, res) => {
    try {
      // Obtener todos los usuarios desde la base de datos
      const allBrecha = await getAllBrecha();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allBrecha,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las brechas',
      });
    }
  };
//sin uso