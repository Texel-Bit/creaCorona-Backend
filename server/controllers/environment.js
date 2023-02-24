const {
  createEnvironment,updateEnvironment, getAllEnvironment
  
  } = require("../models/environment");
  





exports.createEnvironment = async(req, res) => {

    try {
    const { EnvironmentName,EnvironmentProfileImage ,idEnvironmentType,   } = req.body
  const  data= {
    EnvironmentName,
    EnvironmentProfileImage,       
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
      EnvironmentProfileImage,       
      EnvironmentType:{ connect: { idEnvironmentType: +idEnvironmentType } },
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






