const {
    createDesignCompany,updateDesignCompany, getAllDesignCompany
  
  } = require("../models/designCompany");
  





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
    // Desestructurar los campos del cuerpo de la petición
 
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
  
    const { idDesignCompany,DesignCompanyBuyPrice, idCompany,idDesign} = req.body
    const  data= {
      idDesignCompany:+idDesignCompany,
      DesignCompanyBuyPrice:+DesignCompanyBuyPrice,
  
      Company:{ connect: { idCompany: +idCompany } },
  
      Design:{ connect: { idDesign: +idDesign } },
    }

  
    updateDesignCompany(data, (err, result) => {
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