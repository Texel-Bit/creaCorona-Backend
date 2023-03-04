const { subirArchivoImagen } = require("../helpers/subirarchivos");
const {
    createDesignType,updateDesignType, getAllDesignType, getDesignTypeById
  
  } = require("../models/designType");
  





exports.createDesignType = async(req, res) => {

    try {
    const { DesignTypeName} = req.body

    if (!DesignTypeName) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    const image = await subirArchivoImagen(req.files.DesignTypeIconPath,  "uploads/DesignType");
    if (!image) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
  const  data= {
    DesignTypeName,
    DesignTypeIconPath:image,
    
      }

   
      const createdDesignType = await createDesignType(data);

      res.json({
        status: true,
        data: createdDesignType,
      });
    } catch (error) {
  
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No pudo ser creada el tipo de diseño',
        },
      });
    }
  };


  exports.updateDesignType =async (req, res, next) => {
    try {

    // Desestructurar los campos del cuerpo de la petición
    const {idDesignType, DesignTypeName} = req.body

    // Verificar si el cuerpo de la petición existe
    if (!idDesignType || !DesignTypeName ) {
      return res.status(400).json({
        status: false,
        error: "Datos de entrada incompletos",
      });
    }
    const  data= {
      idDesignType:+idDesignType,
      DesignTypeName,
  
  }
  const designType = await getDesignTypeById(data);

  if (req.files && req.files.DesignTypePath) {
    const image = await subirArchivoImagen(
        req.files.DesignTypePath,
        "uploads/DesignType"
      );
  
  
      const filePath = path.join(process.cwd(), designType.DesignTypePath);

      fs.unlinkSync(filePath);
      data.DesignTypePath = image;
        }
  
        const result = await updateDesignType(data);

  

  
  
        res.json({ status: true, data: result });
      } catch (error) {
      res.status(500).json({ status: false, error });
    }
  };

  exports.getAllDesignType  = async (req, res) => {
    try {
      const allDesignType  = await getAllDesignType();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allDesignType,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las Design type',
      });
    }
  };
//sin uso