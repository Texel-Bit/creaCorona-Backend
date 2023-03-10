const { subirArchivoImagen } = require("../helpers/subirarchivos");
const {
    createDesignType,updateDesignType, getAllDesignType, getDesignTypeById, getAllDesignTypeTest
  
  } = require("../models/designType");
  

  const fs = require("fs");
  const path = require("path");



exports.createDesignType = async(req, res) => {

    try {
    const { DesignTypeName,idMosaicType} = req.body

    if (!DesignTypeName||!idMosaicType) {
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
    MosaicType: { connect: { idMosaicType: +idMosaicType } },

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
    const {idDesignType, DesignTypeName,idMosaicType} = req.body

    // Verificar si el cuerpo de la petición existe
    if (!idDesignType || !DesignTypeName  || !idMosaicType) {
      return res.status(400).json({
        status: false,
        error: "Datos de entrada incompletos",
      });
    }
    const  data= {
      idDesignType:+idDesignType,
      DesignTypeName,
      MosaicType: { connect: { idMosaicType: +idMosaicType } },

  }
  const designType = await getDesignTypeById(data);


  if (req.files && req.files.DesignTypeIconPath) {
    const image = await subirArchivoImagen(
        req.files.DesignTypeIconPath,
        "uploads/DesignType"
      );
  
  
      const filePath = path.join(process.cwd(), designType.DesignTypeIconPath);

      fs.unlinkSync(filePath);
      data.DesignTypeIconPath = image;
        }
  
        const result = await updateDesignType(data);
        res.json({ status: true, data: result });
      } catch (error) {

        console.log(error);
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
  exports.getAllDesignTypeTest  = async (req, res) => {
    try {

      const {idDesignType} = req.body

      // Verificar si el cuerpo de la petición existe
      if (!idDesignType ) {
        return res.status(400).json({
          status: false,
          error: "Datos de entrada incompletos",
        });
      }
      const  data= {
        idDesignType:+idDesignType,
      }
    

      const allDesignTypeTest  = await getAllDesignTypeTest(data);
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allDesignTypeTest,
      });
    } catch (error) {
      res.status(500).send({
        message: 'No se pudo obtener las Design type',
      });
    }
  };
//sin uso