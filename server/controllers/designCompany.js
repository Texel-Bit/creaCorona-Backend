const {
    createDesignCompany,updateDesignCompany, getAllDesignCompany
  
  } = require("../models/designCompany");
  

  const fs = require("fs");
  const path = require("path");



exports.createDesignCompany = async(req, res) => {

    try {
    const { DesignCompanyBuyPrice, idCompany,idDesign} = req.body

    if (!DesignCompanyBuyPrice || !idCompany || !idDesign) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
  const  data= {
    DesignCompanyBuyPrice:+DesignCompanyBuyPrice,

    Company:{ connect: { idCompany: +idCompany } },

    Design:{ connect: { idDesign: +idDesign } },
    
      }

   
      const createdDesignCompany = await createDesignCompany(data);

      res.json({
        status: true,
        data: createdDesignCompany,
      });
    } catch (error) {
  
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No pudo ser creada el desingCompany',
        },
      });
    }
  };


  exports.updateDesignCompany =async (req, res, next) => {

    try {

    const { idDesignCompany,DesignCompanyBuyPrice, idCompany,idDesign} = req.body
   
    if (!idDesignCompany || !DesignCompanyBuyPrice || !idCompany || !idDesign) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
   
   
    const  data= {
      idDesignCompany:+idDesignCompany,
      DesignCompanyBuyPrice:+DesignCompanyBuyPrice,
  
      Company:{ connect: { idCompany: +idCompany } },
  
      Design:{ connect: { idDesign: +idDesign } },
    }
    const result = await updateDesignCompany(data);

  
    res.json({
      status: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No se logró crear el Diseño",
      },
    });
  }
};

  exports.getAllDesignCompany  = async (req, res) => {
    try {
      const allDesignCompany  = await getAllDesignCompany();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allDesignCompany,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las Design company',
      });
    }
  };
//sin uso