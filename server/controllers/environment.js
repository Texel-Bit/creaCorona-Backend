const {
  createEnvironment,updateEnvironment, getAllEnvironment, getEnvironmentById
  
  } = require("../models/environment");
  





exports.createEnvironment = async(req, res) => {

    try {
    const { EnvironmentName,idEnvironmentType,   } = req.body

    const image = await subirArchivoImagen(
      req.files,
      ["jpg", "png", "jpeg"],
      "uploads/Environment"
    );
  
  const  data= {
    EnvironmentName,
    EnvironmentProfileImage:image,       
    EnvironmentType:{ connect: { idEnvironmentType: +idEnvironmentType } },
      }

   
      const createdEnvironment = await createEnvironment(data);

      res.json({
        status: true,
        data: createdEnvironment,
      });
    } catch (error) {
  
      return res.status(400).json({
        status: false,
        err: {
          message: 'No pudo ser el color del diseño',
        },
      });
    }
  };


  exports.updateEnvironment =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const { idEnvironment,EnvironmentName,EnvironmentProfileImage ,idEnvironmentType,   } = req.body
    const  data= {
      idEnvironment:+idEnvironment,
      EnvironmentName,
             
      EnvironmentType:{ connect: { idEnvironmentType: +idEnvironmentType } },
        }

        if (req.files) {
          const image = await subirArchivoImagen(
            req.files,
            ["jpg", "png", "jpeg"],
            "uploads/Environment"
          );
      
          const environment = await getEnvironmentById(data);
      
          const filePath = path.join(process.cwd(), environment.EnvironmentProfileImage);
      
          (data.EnvironmentProfileImage = image), fs.unlinkSync(filePath);
        }
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
  

      updateEnvironment(data, (err, result) => {
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

  exports.getAllEnvironment  = async (req, res) => {
    try {
      const allEnvironment  = await getAllEnvironment();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allEnvironment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las Environment',
      });
    }
  };
//sin uso






