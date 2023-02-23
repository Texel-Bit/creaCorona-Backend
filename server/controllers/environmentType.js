const {
  createEnvironmentType,updateEnvironmentType
  
  } = require("../models/environmentType");
  





exports.createEnvironmentType = async(req, res) => {

    try {
    const { EnvironmentTypeName, EnvironmentTypeImage  } = req.body
  const  data= {
    EnvironmentTypeName,
    EnvironmentTypeImage,       
   
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
//sin uso






