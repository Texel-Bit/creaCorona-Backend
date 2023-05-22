const {
  createquotation,

  getAllQuotation,
  createDesignColorshasquotation,
  createQuotationProductDetails,
} = require("../models/quotation.js");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { getFormatSizeTextureById } = require("../models/formatSizeTexture.js");
const { getBundleDesignTypeFormatSizeTexture } = require("../models/bundle.js");
const { getAllOfficeByIdoffice } = require("../models/office.js");
const { getCompanyById } = require("../models/company.js");
const {
  getBundleCompanyPriceByBundleCompanyTypeComopanyZone,
} = require("../models/bundleCompanyPrice.js");
const { log } = require("console");

exports.createquotation = async (req, res) => {

  console.log(req.body);
  try {
    const token = req.get("JWT");

    let {
      user: { idsysuser, office_idoffice },
    } = await promisify(jwt.verify)(token, process.env.SEED);

    if (!idsysuser) {
      idsysuser = 1;
    }
    const {
      customerName,
      customerLastname,
      customerEmail,
      customerPhoneNumber,
      quotationWidth,
      quotationHeight,
      idbrecha,
      idFormatSizeTexture,
      quatitionArea,
      demo
      // idbundleCompanyPrice
    } = req.body;

    if (
      !customerName ||
      !customerLastname ||
      !customerEmail ||
      !customerPhoneNumber ||
      !quatitionArea ||
      !idbrecha ||
      !idFormatSizeTexture||
      !demo
    ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    const simulationImage = await subirArchivoImagen(
      req.files.simulationImage,
      "uploads/quotation"
    );
    const desingPatterImage = await subirArchivoImagen(
      req.files.simulationImage,
      "uploads/quotation"
    );

    

    // Manejo de errores de subirArchivoImagen
    if (!desingPatterImage||!simulationImage) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
    const fortmatTexture = {
      idFormatSizeTexture: +idFormatSizeTexture,
    };
    const { DesignTypeFormatSize } = await getFormatSizeTextureById(
      fortmatTexture
    );

    const office = {
      idoffice: office_idoffice,
    };

    const areaValdosa =
      (DesignTypeFormatSize.DesignTypeFormatSizeHeight *
        DesignTypeFormatSize.DesignTypeFormatSizeWidht) /
        10000;

      //redondear al nyumero mayor
    const cantidadValdosas =Math.ceil(quatitionArea / areaValdosa) 

    const bundle = await getBundleDesignTypeFormatSizeTexture(fortmatTexture);

    const quotationPrice =areaValdosa * cantidadValdosas * bundle[0].bundleBasePrice;

    const { companyZone_idcompanyZone, Company_idCompany } =
      await getAllOfficeByIdoffice(office);

    const company = {
      idCompany: Company_idCompany,
    };
    const { companyType_idcompanyType } = await getCompanyById(company);

    const bundleCompanyPrice = {
      idcompanyZone: companyZone_idcompanyZone,
      idbundle: bundle[0].idbundle,
      idcompanyType: companyType_idcompanyType,
    };

    const { price, idbundleCompanyPrice } =
      await getBundleCompanyPriceByBundleCompanyTypeComopanyZone(
        bundleCompanyPrice
      );

    if (price == undefined) {
      return res.status(400).json({
        ok: false,
        err: {
          message:
            "No pudo ser creado la cotizacion no existe bundleCompanyPrice",
        },
      });
    }
    const data = {
      customerName,
      customerLastname,
      customerEmail,
      simulationImage:simulationImage,
      quatitionArea:+quatitionArea,
      customerPhoneNumber: customerPhoneNumber.toString(),
      quotationBundlePrice: +bundle[0].bundleBasePrice,
      quotationPrice: +quotationPrice,
      quotationWidth: +quotationWidth,
      quotationHeight: +quotationHeight,
      quotationDate: new Date(),
      quotationCompanyPrice: price,
      FormatSizeTexture: {
        connect: { idFormatSizeTexture: +idFormatSizeTexture },
      },
      quotationStatus: {
        connect: { idquotationStatus: 1 },
      },
      brecha: {
        connect: { idbrecha: +idbrecha },
      },
      bundleCompanyPrice: {
        connect: { idbundleCompanyPrice: +idbundleCompanyPrice },
      },
      sysUser: { connect: { idsysuser: +idsysuser } },
    };

   
if (demo==2) {
  const createdquotation = await createquotation(data);
console.log(createdquotation,"hola");
  const arrProductDetails = req.body.quotationProductDetails;

  arrProductDetails.forEach((element, index) => {
    arrProductDetails[index].quotation_idquotation =
      +createdquotation.idquotation;
  });

  const createdQuotationProductDetails = await createQuotationProductDetails(
    arrProductDetails
  );

  const arrDesignColorshasquotation = req.body.DesignColors_has_quotation;
  arrDesignColorshasquotation.forEach((element, index) => {
    arrDesignColorshasquotation[index].quotation_idquotation =
      +createdquotation.idquotation;
  });

  const createdDesignColorshasquotation =
    await createDesignColorshasquotation(arrDesignColorshasquotation);
    createdquotation.cantidadValdosas = cantidadValdosas;
    res.json({
      status: true,
      data: createdquotation,
    });
}else{
  data.cantidadValdosas = cantidadValdosas;
  res.json({
    status: true,
    data,
  });
}
   
   
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No pudo ser creado la cotizacion",
        error,
      },
    });
  }
};
exports.simulateQuotation = async (req, res) => {

  try {
    const token = req.get("JWT");

    let {
      user: { idsysuser, office_idoffice },
    } = await promisify(jwt.verify)(token, process.env.SEED);

    if (!idsysuser) {
      idsysuser = 1;
    }
    const {
    
      quotationWidth,
      quotationHeight,
      idbrecha,
      idFormatSizeTexture,
      quatitionArea,
      // idbundleCompanyPrice
    } = req.body;

    if (
      
      !quatitionArea ||
      !idbrecha ||
      !idFormatSizeTexture
    ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }


    


    const fortmatTexture = {
      idFormatSizeTexture: +idFormatSizeTexture,
    };
    const { DesignTypeFormatSize } = await getFormatSizeTextureById(
      fortmatTexture
    );

    const office = {
      idoffice: office_idoffice,
    };

    const areaValdosa =
      (DesignTypeFormatSize.DesignTypeFormatSizeHeight *
        DesignTypeFormatSize.DesignTypeFormatSizeWidht) /
        10000;

      //redondear al nyumero mayor
    const cantidadValdosas =Math.ceil(quatitionArea / areaValdosa) 

    const bundle = await getBundleDesignTypeFormatSizeTexture(fortmatTexture);

    const quotationPrice =areaValdosa * cantidadValdosas * bundle[0].bundleBasePrice;

    const { companyZone_idcompanyZone, Company_idCompany } =
      await getAllOfficeByIdoffice(office);

    const company = {
      idCompany: Company_idCompany,
    };
    const { companyType_idcompanyType } = await getCompanyById(company);

    const bundleCompanyPrice = {
      idcompanyZone: companyZone_idcompanyZone,
      idbundle: bundle[0].idbundle,
      idcompanyType: companyType_idcompanyType,
    };

    const { price, idbundleCompanyPrice } =
      await getBundleCompanyPriceByBundleCompanyTypeComopanyZone(
        bundleCompanyPrice
      );

    if (price == undefined) {
      return res.status(400).json({
        ok: false,
        err: {
          message:
            "No pudo ser creado la cotizacion no existe bundleCompanyPrice",
        },
      });
    }

    const data = {
    
      quatitionArea:+quatitionArea,
      quotationBundlePrice: +bundle[0].bundleBasePrice,
      quotationPrice: +quotationPrice,
      quotationWidth: +quotationWidth,
      quotationHeight: +quotationHeight,
      quotationDate: new Date(),
      quotationCompanyPrice: price,
      FormatSizeTexture: {
        connect: { idFormatSizeTexture: +idFormatSizeTexture },
      },
      quotationStatus: {
        connect: { idquotationStatus: 1 },
      },
      brecha: {
        connect: { idbrecha: +idbrecha },
      },
      bundleCompanyPrice: {
        connect: { idbundleCompanyPrice: +idbundleCompanyPrice },
      },
      sysUser: { connect: { idsysuser: +idsysuser } },
    };
    console.log(1111);

   
  data.cantidadValdosas = cantidadValdosas;
  res.json({
    status: true,
    data,
  });

   
   
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No pudo ser creado la cotizacion",
        error,
      },
    });
  }
};
exports.getAllQuotation = async (req, res) => {
  try {
    const allQuotation = await getAllQuotation();
    
    const updatedQuotation = await Promise.all(allQuotation.map(async (element) => {
      const fortmatTexture = {
        idFormatSizeTexture: +element.FormatSizeTexture_idFormatSizeTexture,
      };
      const { DesignTypeFormatSize } = await getFormatSizeTextureById(fortmatTexture);
  
      const areaValdosa =
        (DesignTypeFormatSize.DesignTypeFormatSizeHeight *
          DesignTypeFormatSize.DesignTypeFormatSizeWidht) /
        10000;
  
      const cantidadValdosas = Math.ceil(element.quatitionArea / areaValdosa);
  
      return { ...element, cantidadValdosas };
    }));
    
    // Enviar la respuesta con las cotizaciones actualizadas
    res.json({
      status: true,
      data: updatedQuotation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las cotizaciones",
    });
  }
};


//sin uso
