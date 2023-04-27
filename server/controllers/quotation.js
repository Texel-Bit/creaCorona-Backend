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
const { getBundleCompanyPriceByBundleCompanyTypeComopanyZone } = require("../models/bundleCompanyPrice.js");
const { log } = require("console");

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
      // idbundleCompanyPrice
    } = req.body;

    if (
      !customerName ||
      !customerLastname ||
      !customerEmail ||
      !customerPhoneNumber ||
      !quotationWidth ||
      !quotationHeight ||
      !idbrecha||
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

    const office={
      idoffice:office_idoffice
    }
    const area = quotationWidth * quotationHeight;
    const cantidadValdosas =
      area /
      (DesignTypeFormatSize.DesignTypeFormatSizeHeight *
        DesignTypeFormatSize.DesignTypeFormatSizeWidht);

    const bundle = await getBundleDesignTypeFormatSizeTexture(fortmatTexture);

    const quotationPrice =
      (area / 1000) * cantidadValdosas * bundle[0].bundleBasePrice;
      console.log(12);

      const {companyZone_idcompanyZone,Company_idCompany}=await getAllOfficeByIdoffice(office);

      const company={
        idCompany:Company_idCompany
      }
     const {companyType_idcompanyType}=await getCompanyById(company);

      const bundleCompanyPrice={
        idcompanyZone: companyZone_idcompanyZone,
        idbundle:bundle[0].idbundle,
        idcompanyType:companyType_idcompanyType
      }

      console.log(bundleCompanyPrice);

const {price,idbundleCompanyPrice}=await getBundleCompanyPriceByBundleCompanyTypeComopanyZone(bundleCompanyPrice);

console.log(price);
if (price == undefined) {
  return res.status(400).json({
    ok: false,
    err: {
      message: "No pudo ser creado la cotizacion no existe bundleCompanyPrice",
      
    },
  });
}    const data = {
      customerName,
      customerLastname,
      customerEmail,
      customerPhoneNumber: customerPhoneNumber.toString(),
      quotationBundlePrice: +bundle[0].bundleBasePrice,
      quotationPrice: +quotationPrice,
      quotationWidth: +quotationWidth,
      quotationHeight: +quotationHeight,
      quotationDate: new Date(),
      quotationCompanyPrice:price,
      FormatSizeTexture: {
        connect: { idFormatSizeTexture: +idFormatSizeTexture },
      },  quotationStatus: {
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


    const createdquotation = await createquotation(data);



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

    res.json({
      status: true,
      data: createdquotation,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No pudo ser creado la cotizacion",
        error
      },
    });
  }
};

exports.getAllQuotation = async (req, res) => {
  try {
    const allQuotation = await getAllQuotation();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allQuotation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las oficinas",
    });
  }
};

//sin uso
