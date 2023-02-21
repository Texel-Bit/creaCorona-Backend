const {
    createCompany,updateCompany
  
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

  
    // Actualizar el usuario
    updateCompany(data, (err, result) => {
      if (err) {
        // Enviar un error si la actualización falla
        return res.status(500).json({
          status: false,
          error: err,
        });
      }
      
  
  
      // Enviar el resultado de la actualización al cliente
      res.json({
        status: true,
        user: result,
      });
    });
  };
//sin uso








// exports.getAllCompanybyBrands = (req, res) => {
//     // Validate request
//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'no se logro crear',
//         });
//         return;

//     }

//     Company.getAllCompanybyBrands((err, data) => {


//         if (err)
//             res.status(500).send({
//                 message: err.message || "no se pudo consultar"
//             });
//         else {
//             // let token = jwt.sign({
//             //     user: user,
//             // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

//             // res.setHeader('token', token);
//             res.json({
//                 status: true,
//                 data
//             });
//         }

//     });


// };




// exports.getCompanyById = (req, res) => {
//     // Validate request

//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }


//     // Create a Customer
//     const company = new Company({
//         idcompany: req.body.idcompany,

//     });

//     Company.getCompanyById(company, (err, data) => {


//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             // let token = jwt.sign({
//             //     user: user,
//             // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

//             // res.setHeader('token', token);

//             res.json({
//                 status: true,
//                 data
//             });
//         }

//     });


// };


// exports.updateInfoCompanyById = (req, res, next) => {
//     const company = new Company({
//         idcompany: req.body.idcompany,
//         nameCompany: req.body.nameCompany,
//         nit:req.body.nit,
//         createdDate:new Date(),
//         companyType_idcompanyType: req.body.companyType_idcompanyType
//     });

//     Company.updateInfoCompanyById(company, (err, data) => {



//         if (err)
//         res.status(500).send({
//             message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//         });
//     else {
//         // let token = jwt.sign({
//         //     user: user,
//         // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

//         // res.setHeader('token', token);

//         res.json({
//             status: true,
//             data
//         });
//     }


//     });


// };

// exports.activeCompanyById = (req, res, next) => {
 
//     Company.activeCompanyById(req.body, (err, data) => {



//         res.json({
//             status: true,
//             user: data,
            

//         });



//     });


// };

// exports.inactiveCompanyById = (req, res, next) => {
//     Company.inactiveCompanyById(req.body, (err, data) => {



//         res.json({
//             status: true,
//             user: data,
            

//         });



//     });
// };
// exports.filterCompanies = (req, res, next) => {
//     const filtros = ({
//         companyType_idcompanyType: req.body.companyType_idcompanyType,
//         idstatus:req.body.idstatus
      
//     });

//     Company.filterCompanies(filtros, (err, data) => {


//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
          

//             res.json({
//                 status: true,
//                 data
//             });
//         }



//     });


// };





exports.getBrandsByCompany = (req, res, next) => {

    Company.getBrandsByCompany(req.body.idcompany, (err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the userTypeCompanyUser."
            });
        else {
            // let token = jwt.sign({
            //     user: user,
            // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            // res.setHeader('token', token);

            res.json({
                status: true,
                data
            });
        }



    });


};


