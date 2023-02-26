const {
  createEnvironmentType,updateEnvironmentType, getAllEnvironmentType
  
  } = require("../models/environmentType");
  





exports.createEnvironmentType = async(req, res) => {

    try {
    const { EnvironmentTypeName  } = req.body

    const image = await subirArchivoImagen(req.files, ["jpg", "png", "jpeg"], "uploads/EnvironmentType");

  const  data= {
    EnvironmentTypeName,
    EnvironmentTypeImage:image,       
   
      }

   
      const createdEnvironmentType = await createEnvironmentType(data);

      res.json({
        status: true,
        data: createdEnvironmentType,
      });
    } catch (error) {
  
      return res.status(400).json({
        status: false,
        err: {
          message: 'No pudo ser el Enviromenttype',
        },
      });
    }
  };


  exports.updateEnvironmentType =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const { idEnvironmentType,EnvironmentTypeName, EnvironmentTypeImage  } = req.body
    
        
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
  
    const  data= {
      idEnvironmentType:+idEnvironmentType,
      EnvironmentTypeName,
      EnvironmentTypeImage,       
       }
       if (req.files) {
        const image = await subirArchivoImagen(
          req.files,
          ["jpg", "png", "jpeg"],
          "uploads/EnvironmentType"
        );
  
        const environmentType = await getAllEnvironmentType(data);
  
     
        const filePath = path.join(process.cwd(), environmentType.EnvironmentTypeImage);
  
        
        (data.EnvironmentTypeImage = image), fs.unlinkSync(filePath);
      }
  
      updateEnvironmentType(data, (err, result) => {
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

  exports.getAllEnvironmentType  = async (req, res) => {
    try {
      const allEnvironmentType = await getAllEnvironmentType();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allEnvironmentType,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las EnvironmentType',
      });
    }
  };
//sin uso






