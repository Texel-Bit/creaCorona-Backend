const {
  createquotation,

  getAllQuotation,
  createDesignColorshasquotation,
  createQuotationProductDetails,
} = require("../models/quotation.js");

const { getStateByIdState } = require("../models/state");

const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const {
  getFormatSizeTextureById,
  getDefaultFormatSizeTextureById,
} = require("../models/formatSizeTexture.js");
const { getBundleDesignTypeFormatSizeTexture } = require("../models/bundle.js");
const { getCurrentSettings } = require("../models/settings.js");
const { getAllOfficeByIdoffice } = require("../models/office.js");
const { getCompanyById } = require("../models/company.js");
const {
  getBundleCompanyPriceByBundleCompanyTypeComopanyZone,
} = require("../models/bundleCompanyPrice.js");
const { subirArchivoImagen } = require("../helpers/subirarchivos");

const { getBundlePriceByZone } = require("../models/bundlepricesbyzone.js");
const emailSend = require("../helpers/email");
const fs = require("fs");
const path = require("path");
const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const url = fs.readFileSync(path.join(__dirname, '../pdf/corona.pdf'));

const pngImageBytes = fs.readFileSync(path.join(__dirname, '../pdf/unnamed.png'));


exports.createquotation = async (req, res) => {
  try {
    const token = req.get("JWT");

    let {
      user: { idsysuser, office_idoffice, office },
    } = await promisify(jwt.verify)(token, process.env.SEED);

    if (!idsysuser) {
      idsysuser = 1;
    }
    let {
      customerName,
      customerLastname,
      customerEmail,
      customerPhoneNumber,
      quotationWidth,
      quotationHeight,
      idbrecha,
      idFormatSizeTexture,
      idFormatSize,
      quatitionArea,
      idstate,

      // idbundleCompanyPrice
    } = req.body;

    if (!idFormatSizeTexture) {
      if (req.body.idFormatSize) {
        let defaultFormatSizeTexture = await getDefaultFormatSizeTextureById(
          req.body.idFormatSize
        );

        idFormatSizeTexture = defaultFormatSizeTexture.idFormatSizeTexture;
      }
    }

    if (
      !customerName ||
      !customerLastname ||
      !customerEmail ||
      !customerPhoneNumber ||
      !quatitionArea ||
      !idbrecha ||
      !idFormatSizeTexture ||
      !idstate
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

    const officeInfo = {
      idoffice: office_idoffice,
    };

    const areaValdosa =
      (DesignTypeFormatSize.DesignTypeFormatSizeHeight *
        DesignTypeFormatSize.DesignTypeFormatSizeWidht) /
      10000;

    const currentSetting = await getCurrentSettings();

    quatitionArea =
      quatitionArea +
      (quatitionArea * currentSetting[0].SystemSetupGarbagePercenttage) / 100;

    //redondear al nyumero mayor
    const cantidadValdosas = Math.ceil(quatitionArea / areaValdosa);

    const bundle = await getBundleDesignTypeFormatSizeTexture(fortmatTexture);
    var state;

    if (office.Company_idCompany == 1) {
      state = {
        idstate,
      };
    } else {
      state = {
        idstate: office.state_idstate,
      };
    }
    const { companyZone_idcompanyZone } = await getStateByIdState(state);

    const PriceByBundlePrice = {
      idBundle: bundle[0].idbundle,
      companyZone_idcompanyZone,
    };
    const bundlePriceZone = await getBundlePriceByZone(PriceByBundlePrice);
    const quotationPrice = Math.round(
      cantidadValdosas * bundlePriceZone[0].price
    );

    const { Company_idCompany } = await getAllOfficeByIdoffice(officeInfo);

    const company = {
      idCompany: Company_idCompany,
    };
    const { companyType_idcompanyType } = await getCompanyById(company);

    const bundleCompanyPrice = {
      idcompanyZone: companyZone_idcompanyZone,
      idbundle: bundle[0].idbundle,
      idcompanyType: companyType_idcompanyType,
    };

    // const { price, idbundleCompanyPrice } =
    //   await getBundleCompanyPriceByBundleCompanyTypeComopanyZone(
    //     bundleCompanyPrice
    //   );

    // if (price == undefined) {
    //   return res.status(400).json({
    //     ok: false,
    //     err: {
    //       message:
    //         "No pudo ser creado la cotizacion no existe bundleCompanyPrice",
    //     },
    //   });
    // }
    const data = {
      customerName,
      customerLastname,
      customerEmail,
      simulationImage: simulationImage,
      desingPatternImage: desingPatternImage,
      quatitionArea: +quatitionArea,
      customerPhoneNumber: customerPhoneNumber.toString(),
      bundlePrice: +bundlePriceZone[0].price,
      quotationPrice: +quotationPrice,
      quotationWidth: +quotationWidth,
      quotationHeight: +quotationHeight,
      quotationDate: new Date(),
      // quotationCompanyPrice: price,
      FormatSizeTexture: {
        connect: { idFormatSizeTexture: +idFormatSizeTexture },
      },
      quotationStatus: {
        connect: { idquotationStatus: 1 },
      },
      brecha: {
        connect: { idbrecha: +idbrecha },
      },
      // bundleCompanyPrice: {
      //   connect: { idbundleCompanyPrice: +idbundleCompanyPrice },
      // },
      sysUser: { connect: { idsysuser: +idsysuser } },
    };

    const createdquotation = await createquotation(data);
    const arrProductDetails = JSON.parse(req.body.quotationProductDetails);

    arrProductDetails.forEach((element, index) => {
      arrProductDetails[index].quotation_idquotation =
        +createdquotation.idquotation;
    });

    const createdQuotationProductDetails = await createQuotationProductDetails(
      arrProductDetails
    );

    const arrDesignColorshasquotation = JSON.parse(
      req.body.DesignColors_has_quotation
    );
    var arrDesignColorshasquotationFinal = [];
    arrDesignColorshasquotation.forEach((element, index) => {
      if (element.Design_idDesign != -1) {
        arrDesignColorshasquotationFinal[index] =
          arrDesignColorshasquotation[index];
        arrDesignColorshasquotationFinal[index].quotation_idquotation =
          +createdquotation.idquotation;
      } else {
      }
    });

    const createdDesignColorshasquotation =
      await createDesignColorshasquotation(arrDesignColorshasquotationFinal);
    createdquotation.cantidadValdosas = cantidadValdosas;

    data.cantidadValdosas = cantidadValdosas;

    const pdfDoc = await PDFDocument.load(url);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // var fecha = new Date(req.CreatedDate.toString());
    // var options = { year: 'numeric', month: 'long', day: 'numeric' };

    const pages = pdfDoc.getPages();
    const firstPage = pages[1];
    const pngImage = await pdfDoc.embedPng(pngImageBytes)
    const { width, height } = firstPage.getSize();

    let fontSize = 8;
    firstPage.drawText("0001111 ", {
      x: 500,
      y: 720,
      size: 13,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    }),
    firstPage.drawImage(pngImage, {
      x:50,
      y: 660,
      width: 60,
      height: 50,
    })
    firstPage.drawText(new Date().toDateString() + " ", {
      x: 350,
      y: 700,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    }),
      firstPage.drawText("Carlos Colmenares ", {
        x: 350,
        y: 690,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      firstPage.drawText("109873570 ", {
        x: 370,
        y: 680,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      firstPage.drawText("calle 22 15 38 ", {
        x: 360,
        y: 670,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      firstPage.drawText("3167445579 ", {
        x: 360,
        y: 660,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      firstPage.drawText("carlosmanuelcolmenares@gmail.com ", {
        x: 360,
        y: 650,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),

        //Datos asesor
      }),firstPage.drawText( " El Centro", {
        x: 160,
        y: 699,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
        firstPage.drawText("Transversal 138 #58-62 ", {
          x: 160,
          y: 688,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),
        firstPage.drawText("6339090 ", {
          x: 160,
          y: 677,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),
        firstPage.drawText("Pedro Perez ", {
          x: 160,
          y: 666,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),
        firstPage.drawText("6667777", {
          x: 395,
          y: 410,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),
        firstPage.drawText("900000", {
          x: 395,
          y: 395,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),   firstPage.drawText("100000", {
          x: 395,
          y: 378,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),
        firstPage.drawText("1000000", {
          x: 395,
          y: 365,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),
        firstPage.drawImage(pngImage, {
          x:30,
          y: 130,
          width: 100,
          height: 80,
        })

        firstPage.drawImage(pngImage, {
          x:470,
          y: 130,
          width: 100,
          height: 80,
        })
      
      
 

    // firstPage.drawText("Barrancabermeja " + fecha.toLocaleDateString("es-ES", options) + " ", {
    //     x: (width / 2) - 60,
    //     y: height / 2 - 140,
    //     size: 10,
    //     font: helveticaFont,
    //     color: rgb(0, 0, 0),
    //     rotate: degrees(0),
    // })
    const pdfBytes = await pdfDoc.save();
    console.log(112);

    data.pdfBytes = pdfBytes;
    console.log(12);

    await emailSend.sendEmailActivationCode(data);
    console.log(13);

    return res.status(200).json({
      status: true,
      message: "cotizacion creada correctametne",
      data: createdquotation,
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
      user: { idsysuser, office_idoffice, office },
    } = await promisify(jwt.verify)(token, process.env.SEED);

    if (!idsysuser) {
      idsysuser = 1;
    }
    let {
      quotationWidth,
      quotationHeight,
      idFormatSizeTexture,
      quatitionArea,
      idstate,
      idFormatSize,
      // idbundleCompanyPrice
    } = req.body;

    console.log(req.body.idFormatSize);

    if (!idFormatSizeTexture) {
      if (req.body.idFormatSize) {
        let defaultFormatSizeTexture = await getDefaultFormatSizeTextureById(
          req.body.idFormatSize
        );

        idFormatSizeTexture = defaultFormatSizeTexture.idFormatSizeTexture;
      }
    }

    if (!quatitionArea || !idFormatSizeTexture || !idstate) {
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

    const officeInfo = {
      idoffice: office_idoffice,
    };

    const areaValdosa =
      (DesignTypeFormatSize.DesignTypeFormatSizeHeight *
        DesignTypeFormatSize.DesignTypeFormatSizeWidht) /
      10000;
    const currentSetting = await getCurrentSettings();

    quatitionArea =
      quatitionArea +
      (quatitionArea * currentSetting[0].SystemSetupGarbagePercenttage) / 100;

    //redondear al nyumero mayor
    const cantidadValdosas = Math.ceil(quatitionArea / areaValdosa);

    const bundle = await getBundleDesignTypeFormatSizeTexture(fortmatTexture);

    var state;

    if (office.Company_idCompany == 1) {
      state = {
        idstate,
      };
    } else {
      state = {
        idstate: office.state_idstate,
      };
    }
    const { companyZone_idcompanyZone } = await getStateByIdState(state);
    const PriceByBundlePrice = {
      idBundle: bundle[0].idbundle,
      companyZone_idcompanyZone,
    };

    const bundlePriceZone = await getBundlePriceByZone(PriceByBundlePrice);

    const quotationPrice = Math.round(
      cantidadValdosas * bundlePriceZone[0].price
    );

    const { Company_idCompany } = await getAllOfficeByIdoffice(officeInfo);

    const company = {
      idCompany: Company_idCompany,
    };
    const { companyType_idcompanyType } = await getCompanyById(company);

    const bundleCompanyPrice = {
      idcompanyZone: companyZone_idcompanyZone,
      idbundle: bundle[0].idbundle,
      idcompanyType: companyType_idcompanyType,
    };

    // const { price, idbundleCompanyPrice } =
    //   await getBundleCompanyPriceByBundleCompanyTypeComopanyZone(
    //     bundleCompanyPrice
    //   );

    // if (price == undefined) {
    //   return res.status(400).json({
    //     ok: false,
    //     err: {
    //       message:
    //         "No pudo ser creado la cotizacion no existe bundleCompanyPrice",
    //     },
    //   });
    // }

    const data = {
      quatitionArea: +quatitionArea,
      bundlePrice: +bundlePriceZone[0].price,
      quotationPrice: +quotationPrice,
      quotationWidth: +quotationWidth,
      quotationHeight: +quotationHeight,

      // quotationCompanyPrice: price,

      // bundleCompanyPrice: {
      //   connect: { idbundleCompanyPrice: +idbundleCompanyPrice },
      // },
      sysUser: { connect: { idsysuser: +idsysuser } },
    };

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
    res.status(500).send({
      message: "No se pudo obtener las cotizaciones",
    });
  }
};

//sin uso
