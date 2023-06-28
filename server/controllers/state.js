const {
    createState,
    updateState,
    getAllState,
    deleteState
    // getDesignById,
  } = require("../models/state");

  exports.createState = async (req, res) => {
    try {
      // Validar datos de entrada
      const { stateName, idcompanyZone } = req.body;
      if (!stateName || !idcompanyZone ) {
        return res.status(400).json({
          status: false,
          err: {
            message: "Datos de entrada incompletos",
          },
        });
      }
  
     
  
      const data = {
        stateName,
          companyZone: { connect: { idcompanyZone: +idcompanyZone } },
      };
  
      const result = await createState(data);
  
      res.json({
        status: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        err: {
          message: "No se logró crear el state",
        },
      });
    }
  };
  exports.updateState =async (req, res, next) => {
    try {
    // Verificar si el cuerpo de la petición existe
    const { idstate,stateName, idcompanyZone } = req.body;

    if (!idstate||!stateName||!idcompanyZone) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }


  const  data= {
    idstate:+idstate,
    stateName,
    companyZone: { connect: { idcompanyZone: +idcompanyZone } },

      }
  const state = await updateState(data);



  
        res.json({ status: true, data });
      } catch (error) {

      res.status(500).json({ status: false, error });
    }
  };
  exports.deleteState =async (req, res, next) => {
    try {
    // Verificar si el cuerpo de la petición existe
    const { idstate } = req.body;

    if (!idstate) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }


  const  data= {
    idstate:+idstate,


      }
  const state = await deleteState(data);



  
        res.json({ status: true, data });
      } catch (error) {

      res.status(500).json({ status: false, error });
    }
  };
  
  exports.getAllState = async (req, res) => {
    try {
      // Obtener todos los usuarios desde la base de datos
      const allState = await getAllState();
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allState,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "No se pudo obtener las Design",
      });
    }
  };
  //sin uso
  