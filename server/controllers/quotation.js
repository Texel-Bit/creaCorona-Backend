const {
  createquotation,
  
  getAllQuotation,
  createDesignColorshasquotation,
  createQuotationProductDetails
} = require("../models/quotation.js");
const jwt = require("jsonwebtoken");
const { promisify } = require('util');

exports.createquotation = async (req, res) => {
  try {
    const token = req.get('JWT');


    let { user: { idsysuser } } = await promisify(jwt.verify)(token, process.env.SEED);

if (!idsysuser) {
  idsysuser=1
}
    const {
      customerName,
      customerLastname,
      customerEmail,
      customerPhoneNumber,
      // quotationBundlePrice,
      // quotationPrice,
      quotationWidth,
      quotationHeight,
      
      idFormatSizeTexture,
      idbundleCompanyPrice
    } = req.body;

    if (
      !customerName ||
      !customerLastname ||
      !customerEmail ||
      !customerPhoneNumber ||
      // !quotationBundlePrice ||
      // !quotationPrice ||
      !quotationWidth ||
      !quotationHeight ||
      !idFormatSizeTexture ||
      !idbundleCompanyPrice
    ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const data = {
      customerName,
      customerLastname,
      customerEmail,
      customerPhoneNumber:customerPhoneNumber.toString(),
      quotationBundlePrice:+quotationBundlePrice,
      quotationPrice:+quotationPrice,
      quotationWidth:+quotationWidth,
      quotationHeight:+quotationHeight,
      quotationDate:new Date(),
      FormatSizeTexture: { connect: { idFormatSizeTexture: +idFormatSizeTexture } },
      bundleCompanyPrice: { connect: { idbundleCompanyPrice: +idbundleCompanyPrice } },
      sysUser: { connect: { idsysuser: +idsysuser } },

    };

    const createdquotation = await createquotation(data);



const arrProductDetails = req.body.quotationProductDetails


arrProductDetails.forEach((element,index)  => {
    arrProductDetails[index].quotation_idquotation=+createdquotation.idquotation
});


const createdQuotationProductDetails = await createQuotationProductDetails(arrProductDetails);


const arrDesignColorshasquotation = req.body.DesignColors_has_quotation
arrDesignColorshasquotation.forEach((element,index)  => {
    arrDesignColorshasquotation[index].quotation_idquotation=+createdquotation.idquotation
});


const createdDesignColorshasquotation = await createDesignColorshasquotation(arrDesignColorshasquotation);

    res.json({
      status: true,
      data: createdquotation,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      err: {
        message: "No pudo ser creado la cotizacion",
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
