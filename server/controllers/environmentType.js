const {
  createEnvironmentType,updateEnvironmentType, getAllEnvironmentType, getEnvironmentTypeById  
  } = require("../models/environmentType");
  

  const { subirArchivoImagen } = require("../helpers/subirarchivos");

  const path = require('path');
  const fs = require('fs');

exports.createEnvironmentType = async(req, res) => {
 

    try {
    const { EnvironmentTypeName  } = req.body
    if (!EnvironmentTypeName ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    const image = await subirArchivoImagen(req.files.EnvironmentTypeImage,"uploads/EnvironmentType");
    if (!image) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
  const  data= {
    enviroment:{    EnvironmentTypeName,
      EnvironmentTypeImage:image 
      
    }

    
  
   
      }
 const arr = req.body.designTypeEnvironmentType.map(type => ({ idDesignType: type }));

data.designTypeEnvironmentType = arr;
      const createdEnvironmentType = await createEnvironmentType(data);


      res.json({
        status: true,
        data: createdEnvironmentType,
      });
    } catch (error) {
      console.log(error);
  
      return res.status(400).json({
        status: false,
        err: {
          message: 'No pudo ser el tipo de ambiente',
        },
      });
    }
  };


  exports.updateEnvironmentType =async (req, res, next) => {
    try {

    // Desestructurar los campos del cuerpo de la petición
    const { idEnvironmentType,EnvironmentTypeName  } = req.body
    
        
    if (!idEnvironmentType||!EnvironmentTypeName) {
      return res.status(400).json({ status: false, err: { message: "Datos de entrada incompletos" } });
    }
    const  data= {
      idEnvironmentType:+idEnvironmentType,
      EnvironmentTypeName,
       }
    const environmentType = await getEnvironmentTypeById(data);


    console.log(environmentType,"hola");
       if (req.files && req.files.EnvironmentTypeImage) {
        const image = await subirArchivoImagen(req.files.EnvironmentTypeImage, "uploads/EnvironmentType");
        const filePath = path.join(process.cwd(), environmentType.EnvironmentTypeImage);
        fs.unlinkSync(filePath);
        data.EnvironmentTypeImage = image;
      }
  
      
    const result = await updateEnvironmentType(data);
    res.json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }

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
        status: false,

        message: 'No se pudo obtener las EnvironmentType',
      });
    }
  };
//sin uso






