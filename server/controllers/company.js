const {
    createCompany,updateCompany,getAllCompany
  
  } = require("../models/company");
  





exports.createCompany = async(req, res) => {

    try {
    const { CompanyName, CompanyAddress, CompanyImagePath, CompanyNIT, CompanyPhone, idcompanyStatus, idCompanyRole } = req.body
  const  data= {
        CompanyName,
        CompanyAddress,
        CompanyImagePath,
        CompanyNIT,
        CompanyPhone,
        companyStatus:{ connect: { idcompanyStatus: +idcompanyStatus } },
        CompanyRole:{ connect: { idCompanyRole: +idCompanyRole } },
      }

   
      const createdCompany = await createCompany(data);

      res.json({
        status: true,
        data: createdCompany,
      });
    } catch (error) {
  
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No pudo ser creada la compañia',
        },
      });
    }
  };


  exports.updateCompany =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const {idCompany, CompanyName, CompanyAddress, CompanyImagePath, CompanyNIT, CompanyPhone, idcompanyStatus, idCompanyRole } = req.body
  
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
  
    const  data= {
      idCompany:+idCompany,
      CompanyName,
      CompanyAddress,
      CompanyImagePath,
      CompanyNIT,
      CompanyPhone,
      companyStatus:{ connect: { idcompanyStatus: +idcompanyStatus } },
      CompanyRole:{ connect: { idCompanyRole: +idCompanyRole } },
    }

  
    updateCompany(data, (err, result) => {
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

  
  exports.getAllCompany = async (req, res) => {
    try {
      // Obtener todos los usuarios desde la base de datos
      const allCompany = await getAllCompany();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allCompany,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las compañias',
      });
    }
  };

