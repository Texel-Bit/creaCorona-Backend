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
const { subirArchivoImagen } = require("../helpers/subirarchivos");

exports.createquotation = async (req, res) => {
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

      // idbundleCompanyPrice
    } = req.body;

    if (
      !customerName ||
      !customerLastname ||
      !customerEmail ||
      !customerPhoneNumber ||
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

    const simulationImage = await subirArchivoImagen(
      req.files.simulationImage,
      "uploads/quotation"
    );

    const desingPatternImage = await subirArchivoImagen(
      req.files.desingPatternImage,
      "uploads/quotation"
    );

    // Manejo de errores de subirArchivoImagen
    if (!desingPatternImage || !simulationImage) {
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
    console.log(5);

    const office = {
      idoffice: office_idoffice,
    };

    const areaValdosa =
      (DesignTypeFormatSize.DesignTypeFormatSizeHeight *
        DesignTypeFormatSize.DesignTypeFormatSizeWidht) /
      10000;

    //redondear al nyumero mayor
    const cantidadValdosas = Math.ceil(quatitionArea / areaValdosa);

    const bundle = await getBundleDesignTypeFormatSizeTexture(fortmatTexture);

    const quotationPrice =
      areaValdosa * cantidadValdosas * bundle[0].bundleBasePrice;

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
    console.log(10);

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
      simulationImage: simulationImage,
      desingPatternImage: desingPatternImage,
      quatitionArea: +quatitionArea,
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

    console.log(11);

    const createdquotation = await createquotation(data);
    console.log(12);
    const arrProductDetails = JSON.parse(req.body.quotationProductDetails);
    console.log(arrProductDetails, "13");

    console.log(arrProductDetails, "arrProductDetails");
    arrProductDetails.forEach((element, index) => {
      console.log(element, "185");

      arrProductDetails[index].quotation_idquotation =
        +createdquotation.idquotation;
    });
    console.log(13);

    const createdQuotationProductDetails = await createQuotationProductDetails(
      arrProductDetails
    );

    const arrDesignColorshasquotation = JSON.parse(
      req.body.DesignColors_has_quotation
    );
    var arrDesignColorshasquotationFinal = [];
    arrDesignColorshasquotation.forEach((element, index) => {
      console.log(element, "196");
      if (element.Design_idDesign != -1) {
        arrDesignColorshasquotationFinal[index] =
          arrDesignColorshasquotation[index];
        arrDesignColorshasquotationFinal[index].quotation_idquotation =
          +createdquotation.idquotation;
      } else {
      }
    });

    console.log(arrDesignColorshasquotationFinal, "202");
    const createdDesignColorshasquotation =
      await createDesignColorshasquotation(arrDesignColorshasquotationFinal);
    createdquotation.cantidadValdosas = cantidadValdosas;
    // res.json({
    //   status: true,
    //   data: createdquotation,
    // });

    data.cantidadValdosas = cantidadValdosas;
    res.json({
      status: true,
      data:createdquotation
    });

    return res.status(200).json({
      status: true,
      message: "cotizacion creada correctametne",
      data: createdQuotation,
    });
} catch (error) {
  return res.status(400).json({
    status: false,
    error: {
      message: "error to create the quotation",
      data: error,
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

    if (!quatitionArea || !idbrecha || !idFormatSizeTexture) {
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
    const cantidadValdosas = Math.ceil(quatitionArea / areaValdosa);

    const bundle = await getBundleDesignTypeFormatSizeTexture(fortmatTexture);

    const quotationPrice =
      areaValdosa * cantidadValdosas * bundle[0].bundleBasePrice;

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
      quatitionArea: +quatitionArea,
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
        message: "No pudo ser creado la cotizacion msg 1",
        data: error,
      },
    });
  }
};
exports.getAllQuotation = async (req, res) => {
  try {
    const allQuotation = await getAllQuotation();

    const updatedQuotation = await Promise.all(
      allQuotation.map(async (element) => {
        const fortmatTexture = {
          idFormatSizeTexture: +element.FormatSizeTexture_idFormatSizeTexture,
        };
        const { DesignTypeFormatSize } = await getFormatSizeTextureById(
          fortmatTexture
        );

        const areaValdosa =
          (DesignTypeFormatSize.DesignTypeFormatSizeHeight *
            DesignTypeFormatSize.DesignTypeFormatSizeWidht) /
          10000;

        const cantidadValdosas = Math.ceil(element.quatitionArea / areaValdosa);

        return { ...element, cantidadValdosas };
      })
    );

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
