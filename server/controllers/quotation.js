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
const { getBundleDesignTypeFormatSizeTexture,getBundleDesignDataByBundleId } = require("../models/bundle.js");
const { getCurrentSettings } = require("../models/settings.js");
const { getAllOfficeByIdoffice } = require("../models/office.js");
const { getCompanyById } = require("../models/company.js");
const {
  getBundleCompanyPriceByBundleCompanyTypeComopanyZone,
} = require("../models/bundleCompanyPrice.js");
const { subirArchivoImagen,CastBase64ToImage } = require("../helpers/subirarchivos");
const{getDesignColorsByIdList}=require("../models/designColors.js");
const{getDesignByIdList}=require("../models/design.js");

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
      user: { idsysuser,userName,lastName, office_idoffice, office },
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


    if(!idbrecha)
    {
      idbrecha=12;
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



    /*
    const simulationImage = await subirArchivoImagen(
      req.files.simulationImage,
      "uploads/quotation"
    );
*/
    const simulationImage = await CastBase64ToImage(
      req.body.simulationImage,
      "uploads/quotation"
    );

    const desingPatternImage = await CastBase64ToImage(
      req.body.desingPatternImage,
      "uploads/quotation"
    );

    /*
    const desingPatternImage = await subirArchivoImagen(
      req.files.desingPatternImage,
      "uploads/quotation"
    );
*/

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


    const garbage=parseFloat(quatitionArea * currentSetting[0].SystemSetupGarbagePercenttage/100,10)

    quatitionArea = parseFloat(quatitionArea,10) +garbage;

    //redondear al nyumero mayor
    const cantidadValdosas = Math.ceil(quatitionArea / areaValdosa);

    const bundle = await getBundleDesignTypeFormatSizeTexture(fortmatTexture);
    var state;


const BundleFullData=await getBundleDesignDataByBundleId(bundle);

const quotationItemDescription=BundleFullData[0].DesignTypeName+"( "+BundleFullData[0].DesignTypeFormatSizeName+" ) "+ BundleFullData[0].FormatSizeTextureName;

    if (office.Company_idCompany == 1) {
      state = {
        idstate,
      };
    } else {
      state = {
        idstate: office.state_idstate,
      };
    }
    const { companyZone_idcompanyZone,stateName } = await getStateByIdState(state);

    
    const PriceByBundlePrice = {
      idBundle: bundle.idbundle,
      companyZone_idcompanyZone,
    };
    const bundlePriceZone = await getBundlePriceByZone(PriceByBundlePrice);

    

    const quotationPrice = Math.round(
      cantidadValdosas * bundlePriceZone.price
    );

     officeData  = await getAllOfficeByIdoffice(officeInfo);


     company = officeData[0].Company;
      officeState=officeData[0].state
    const bundleCompanyPrice = {
      idcompanyZone: companyZone_idcompanyZone,
      idbundle: bundle.idbundle,
      idcompanyType: company.companyType_idcompanyType,
    };

     const bundleCompanyPriceData = await getBundleCompanyPriceByBundleCompanyTypeComopanyZone(bundleCompanyPrice);

     const price=bundleCompanyPriceData.price;
     const idbundleCompanyPrice=bundleCompanyPriceData.idbundleCompanyPrice;
  

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
      quotationBundlePrice: +bundlePriceZone.price,
      quotationPrice: +quotationPrice,
      quotationWidth: +quotationWidth,
      quotationHeight: +quotationHeight,
      quotationDate: new Date(),
      quotationCompanyPrice: +price,
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


    const createdquotation = await createquotation(data);

    console.log(req.body.quotationProductDetails);
    const arrProductDetails = req.body.quotationProductDetails;


    
    arrProductDetails.forEach((element, index) => {
      arrProductDetails[index].quotation_idquotation =
        +createdquotation.idquotation;
    });

    const createdQuotationProductDetails = await createQuotationProductDetails(
      arrProductDetails
    );

    const arrDesignColorshasquotation = req.body.DesignColors_has_quotation
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


    console.log("Load first path ",path.join(__dirname,"../../", desingPatternImage));

    let tempImage=fs.readFileSync(path.join(__dirname,"../../", desingPatternImage));
    const pdfdesingPatternImage  = await pdfDoc.embedPng(tempImage);


    console.log("Load Second path ",path.join(__dirname,"../../", simulationImage));

    tempImage=fs.readFileSync(path.join(__dirname,"../../", simulationImage));
    const pdfsimulationImage = await pdfDoc.embedPng(tempImage);

    console.log("Load Third path ");

    tempImage=fs.readFileSync(path.join(path.join(__dirname,"../../", company.CompanyImagePath)));
    const pdfPNGLogo = await pdfDoc.embedPng(tempImage);

    const { width, height } = firstPage.getSize();

    console.log("Start To Build PDF ");

    const designColorsDetails = await getDesignColorsByIdList(
      req.body.DesignColors_has_quotation
    );

    const designList = await getDesignByIdList(
      req.body.quotationProductDetails
    );


    let fontSize = 8;

  const InitialDescriptionYPos=600;
  const InitialDescriptionYPadding=fontSize+1;
    
    
    firstPage.drawText(createdquotation.idquotation.toString(), {
      x: 500,
      y: 720,
      size: 13,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    }),
    firstPage.drawImage(pdfPNGLogo, {
      x:20,
      y: 670,
      width: 100,
      height: 40,
    }),
    firstPage.drawText(company.CompanyNIT, {
      x:20,
      y: 660,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    }),
    firstPage.drawText(new Date().toDateString() + " ", {
      x: 350,
      y: 700,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    }),
      firstPage.drawText(customerName+' '+customerLastname, {
        x: 350,
        y: 690,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      firstPage.drawText("--------- ", {
        x: 370,
        y: 680,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      firstPage.drawText("--------- ", {
        x: 360,
        y: 670,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      firstPage.drawText(customerPhoneNumber, {
        x: 360,
        y: 660,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      firstPage.drawText(customerEmail, {
        x: 360,
        y: 650,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),

        //Datos asesor
      }),firstPage.drawText(company.CompanyName+" - "+  office.officeDescription, {
        x: 160,
        y: 699,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      }),
      
        firstPage.drawText(company.CompanyAddress+"  "+officeState.stateName, {
          x: 160,
          y: 688,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),
        firstPage.drawText(company.CompanyPhone, {
          x: 160,
          y: 677,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),
        firstPage.drawText(userName+" "+lastName, {
          x: 160,
          y: 666,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),
        designList.forEach((item, index) => {
          firstPage.drawText(item.DesignName, {
          x: 30,
          y: InitialDescriptionYPos-(index*InitialDescriptionYPadding),
          size: fontSize-1,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        })
      });
        firstPage.drawText(quotationItemDescription, {
          x: 100,
          y: InitialDescriptionYPos,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),

        designColorsDetails.forEach((item, index) => {
            firstPage.drawText(item.DesignColorName, {
            x: 311,
            y: InitialDescriptionYPos-(index*InitialDescriptionYPadding),
            size: fontSize-1,
            font: helveticaFont,
            color: rgb(0, 0, 0),
            rotate: degrees(0),
    
          })
        });
        firstPage.drawText(cantidadValdosas.toString(), {
          x: 360,
          y: InitialDescriptionYPos,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),
        firstPage.drawText(formatCurrency(bundlePriceZone.price.toString()), {
          x: 430,
          y: InitialDescriptionYPos,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
        }),
        firstPage.drawText(formatCurrency(data.quotationPrice.toString()), {
          x: 520,
          y: InitialDescriptionYPos,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),
        firstPage.drawText(formatCurrency(data.quotationPrice.toString()), {
          x: 395,
          y: 410,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),
        firstPage.drawText(formatCurrency(data.quotationPrice*0.19).toString(), {
          x: 395,
          y: 395,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),   firstPage.drawText("----------", {
          x: 395,
          y: 378,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),
        firstPage.drawText(formatCurrency(parseFloat(data.quotationPrice)+parseFloat(data.quotationPrice*0.19)).toString(), {
          x: 395,
          y: 365,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        }),
        designList.forEach((item, index) => {
          firstPage.drawText(index+".) "+item.DesignName, {
          x: 200,
          y: 180-(index*(InitialDescriptionYPadding+2)),
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(0),
  
        })
      });

      designColorsDetails.forEach((item, index) => {
        firstPage.drawText(index+".) "+item.DesignColorName, {
        x: 200,
        y: 100-(index*(InitialDescriptionYPadding+2)),
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),

      })
    });
        firstPage.drawImage(pdfdesingPatternImage, {
          x:20,
          y: 30,
          width: 160,
          height:160,
        })


        firstPage.drawImage(pdfsimulationImage, {
          x:312,
          y: 30,
          width: 280,
          height: 160,
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
    console.log(error);
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

    if(quatitionArea==0)
    {
      quatitionArea=quotationWidth*quotationHeight
    }
      console.log(req.body);

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
      idBundle: bundle.idbundle,
      companyZone_idcompanyZone,
    };

    const bundlePriceZone = await getBundlePriceByZone(PriceByBundlePrice);

    console.log(bundlePriceZone)
    
    const quotationPrice = Math.round(
      (cantidadValdosas * bundlePriceZone.price)
    );

    const officeData = await getAllOfficeByIdoffice(officeInfo);

    const company = {
      idCompany: officeData[0].Company_idCompany,
    };

    const { companyType_idcompanyType } = await getCompanyById(company);



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
      bundlePrice: +bundlePriceZone.price,
      quotationPrice: +(quotationPrice*1.19),
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
    console.log(error);
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

function formatCurrency(price) {
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  });
  return formatter.format(price);
}

//sin uso
