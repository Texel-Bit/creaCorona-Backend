const {
  createEnvironmentType,
  updateEnvironmentType,
  getAllEnvironmentType,
  getEnvironmentTypeById,
  createDesignTypeEnvironmentType,
  getDesignColorTypesByEnvironmentIdAndDesignType,
  addDesignColorTypeToEnvironmentType,
  createDesignTypeFormatSizeForEnvironmentType, 
  deleteDesignTypeFormatSizeForEnvironmentType, 
  getAllDesignTypeFormatSizeForEnvironmentType,
  deleteDesignTypeEnvironmentType
} = require("../models/environmentType");

const { subirArchivoImagen } = require("../helpers/subirarchivos");

const path = require("path");
const fs = require("fs");

exports.createEnvironmentType = async (req, res) => {

  try {
    const { EnvironmentTypeName,WorkWithStructure } = req.body;
    if (!EnvironmentTypeName||!WorkWithStructure) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    const image = await subirArchivoImagen(
      req.files.EnvironmentTypeImage,
      "uploads/EnvironmentType"
    );
    if (!image) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
    const data = {
      EnvironmentTypeName,
      WorkWithStructure:+WorkWithStructure,
      EnvironmentTypeImage: image,
    };

    const createdEnvironmentType = await createEnvironmentType(data);


    res.json({
      status: true,
      data: { createdEnvironmentType },
    });
  } catch (error) {

    return res.status(400).json({
      status: false,
      err: {
        message: "No pudo ser el tipo de ambiente",
      },
    });
  }
};

exports.createDesignTypeEnvironmentType= async (req, res, next) => {
  console.log(req.body);
  try {


    // Desestructurar los campos del cuerpo de la petición

    const result = await createDesignTypeEnvironmentType(req.body);


    res.json({ status: true, data: {result} });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};

exports.updateEnvironmentType = async (req, res, next) => {
  try {

    // Desestructurar los campos del cuerpo de la petición
    const { idEnvironmentType, EnvironmentTypeName,WorkWithStructure } = req.body;

    if (!idEnvironmentType || !EnvironmentTypeName ||!WorkWithStructure) {
      return res
        .status(400)
        .json({
          status: false,
          err: { message: "Datos de entrada incompletos" },
        });
    }
    const data = {
      idEnvironmentType: +idEnvironmentType,
      WorkWithStructure:+WorkWithStructure,
      EnvironmentTypeName,
    };
    const environmentType = await getEnvironmentTypeById(data);

    if (req.files && req.files.EnvironmentTypeImage) {
      const image = await subirArchivoImagen(
        req.files.EnvironmentTypeImage,
        "uploads/EnvironmentType"
      );

      const filePath=path.join(__dirname,environmentType.EnvironmentTypeImage
        );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync();
      }      data.EnvironmentTypeImage = image;
    }

    const result = await updateEnvironmentType(data);

    res.json({ status: true, data: {result} });
  } catch (error) {
    console.log("Error  ",error)
    res.status(500).json({ status: false, error });
  }
};

exports.deleteDesignType_EnvironmentType= async (req, res, next) =>{
  try {
    const allEnvironmentType = await deleteDesignTypeEnvironmentType(req.body);

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allEnvironmentType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,

      message: "No se pudo obtener las EnvironmentType",
    });
  }
}

exports.getAllEnvironmentType = async (req, res) => {
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

      message: "No se pudo obtener las EnvironmentType",
    });
  }
};

exports.getDesignColorTypesByEnvironmentIdAndDesignType = async (req, res) => {
  try {
    const allEnvironmentType = await getDesignColorTypesByEnvironmentIdAndDesignType(req.body.EnvironmentType_idEnvironmentType,req.body.DesignType_idDesignType);

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allEnvironmentType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      data:error,
      message: "No se pudo obtener las EnvironmentType",
    });
  }
};

exports.addDesignColorTypeToEnvironmentType = async (req, res) => {
  try {
    
    console.log("Adding devices ",req.body)
    const DesignColorTypeEnvironmentType = await addDesignColorTypeToEnvironmentType(req.body);


    res.json({
      status: true,
      data: DesignColorTypeEnvironmentType.allRecords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      data:error,
      message: "No se pudo agregar el tipo de diseno",
    });
  }
};


exports.createDesignTypeFormatSizeForEnvironmentType = async (req, res) => {
  try {

    const result = await createDesignTypeFormatSizeForEnvironmentType(req.body);
    
    return res.status(201).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An error occurred", error: e });
  }
};

exports.deleteDesignTypeFormatSizeForEnvironmentType = async (req, res) => {
  try {
    const result = await deleteDesignTypeFormatSizeForEnvironmentType(req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An error occurred", error: e });
  }
};

exports.getAllDesignTypeFormatSizeForEnvironmentType = async (req, res) => {
  try {
    const { EnvironmentType_idEnvironmentType,DesignType_idDesignType } = req.body;
    const result = await getAllDesignTypeFormatSizeForEnvironmentType(EnvironmentType_idEnvironmentType,DesignType_idDesignType);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "An error occurred", error: e });
  }
};


