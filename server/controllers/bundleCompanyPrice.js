const { subirArchivoImagen } = require("../helpers/subirarchivos");
const {
    createBundleCompanyPrice,updateBundleCompanyPrice, getAllBundleCompanyPrice
  
  } = require("../models/bundleCompanyPrice.js");
  

  const fs = require("fs");
  const path = require("path");



exports.createBundleCompanyPrice = async(req, res) => {

    try {
    const { idbundle,idcompanyZone,idcompanyType,price} = req.body

    if (!idbundle||!idcompanyZone||!idcompanyType||!price) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

  const  data= {
    bundle: { connect: { idbundle: +idbundle } },
    companyZone: { connect: { idcompanyZone: +idcompanyZone } },
    companyType: { connect: { idcompanyType: +idcompanyType } },
    price:+price

    

      }

   
      const createdBundleCompanyPrice = await createBundleCompanyPrice(data);

      res.json({
        status: true,
        data: createdBundleCompanyPrice,
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


  exports.updateBundleCompanyPrice =async (req, res, next) => {
    try {

        const { idbundleCompanyPrice,idbundle,idcompanyZone,idcompanyType,price} = req.body

        if (!idbundleCompanyPrice||!idbundle||!idcompanyZone||!idcompanyType||!price) {
          return res.status(400).json({
            status: false,
            err: {
              message: "Datos de entrada incompletos",
            },
          });
        }
        const  data= {
            bundle: { connect: { idbundle: +idbundle } },
            companyZone: { connect: { idcompanyZone: +idcompanyZone } },
            companyType: { connect: { idcompanyType: +idcompanyType } },
            price:+price,
            idbundleCompanyPrice:+idbundleCompanyPrice
        
            
        
              }



        const result = await updateBundleCompanyPrice(data);
        res.json({ status: true, data: result });
      } catch (error) {

        console.log(error);
      res.status(500).json({ status: false, error });
    }
  };

  exports.getAllBundleCompanyPrice  = async (req, res) => {
    try {
      const allBundleCompanyPrice  = await getAllBundleCompanyPrice();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allBundleCompanyPrice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las Design type',
      });
    }
  };
//sin uso