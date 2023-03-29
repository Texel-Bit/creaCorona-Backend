const {
    createOffice,updateOffice,getAllOffice
  } = require("../models/office");
  




exports.createOffice = async(req, res) => {

    try {
    const { officeDescription,idCompany,idcompanyZone} = req.body

    if (!officeDescription||!idCompany||!idcompanyZone) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

  const  data= {
    officeDescription,
    Company: { connect: { idCompany: +idCompany } },
    companyZone: { connect: { idcompanyZone: +idcompanyZone } },

      }

   
      const createdOffice = await createOffice(data);

      res.json({
        status: true,
        data: createdOffice,
      });
    } catch (error) {
  
        console.log(error);
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No pudo ser creado la oficina',
        },
      });
    }
  };


  exports.updateOffice =async (req, res, next) => {
    try {



    // Verificar si el cuerpo de la petición existe
    const { idoffice,officeDescription,idCompany,idcompanyZone} = req.body

    if (!idoffice||!officeDescription||!idCompany||!idcompanyZone) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }


  const  data= {
    idoffice:+idoffice,
    officeDescription,
    Company: { connect: { idCompany: +idCompany } },
    companyZone: { connect: { idcompanyZone: +idcompanyZone } },

      }
  const office = await updateOffice(data);



  
        res.json({ status: true, data: office });
      } catch (error) {

      res.status(500).json({ status: false, error });
    }
  };

  exports.getAllOffice  = async (req, res) => {
    try {
      const allOffice = await getAllOffice();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allOffice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las oficinas',
      });
    }
  };

//sin uso