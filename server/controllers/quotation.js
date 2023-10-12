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

    let idsysuser;
    let office_idoffice;
    let office={Company_idCompany : 1};
    let userName;
    let lastName;
    
    // If JWT is provided, verify it and extract user info from it
    if(req.headers.jwt!==null && req.headers.jwt!=='null') {
      const token = req.get("JWT");
      try {
        let { user: { idsysuser: id, office_idoffice: officeId, office,userName,lastName  } } = await promisify(jwt.verify)(token, process.env.SEED);
        idsysuser = id; // Assign extracted values to outer scope variables
        office_idoffice = officeId;
      } catch (error) {
        // Handle error for invalid token
        console.error("Invalid Token: ", error);
        return res.status(401).json({
          status: false,
          err: {
            message: "Invalid Token",
          },
        });
      }
    }


    if (!idsysuser) {
      idsysuser = 1;
      office_idoffice = 1;
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
      !idbrecha ||
      !idFormatSizeTexture ||
      !idstate
    ) {
      return res.status(400).json({
       
        status: false,
        err: {
          message: "Datos de entrada incompletos 2",
        },
      });
    }

    if(quatitionArea==0)
    {
      quatitionArea=quotationWidth*quotationHeight
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

const quotationItemDescription=BundleFullData[0].DesignTypeFormatSizeName;

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
    const firstPage = pages[0];


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

    pageWidth=width
    pageHeight=height

    console.log("Start To Build PDF ");

    const designColorsDetails = await getDesignColorsByIdList(
      req.body.DesignColors_has_quotation
    );

    const designList = await getDesignByIdList(
      req.body.quotationProductDetails
    );


    let fontSize = 10;

    
    // Constants
const textColor = rgb(0, 0, 0);
const rotationAngle = degrees(0);


// Constants for positioning
const margin = 30;
const halfWidth = pageWidth / 2;
const quarterWidth = pageWidth / 4;
const threeQuarterWidth = (3 * pageWidth) / 4;

const simulatedImageWidth = 267;  // calculated for 16:9 aspect ratio
const simulatedImageHeight = simulatedImageWidth * 9 / 16;

// Company Info - Top right
firstPage.drawImage(pdfPNGLogo, {
    x: pageWidth - 150,
    y: pageHeight - 70,
    width: 100,
    height: 35,
});

firstPage.drawText(company.CompanyNIT, {
    x: pageWidth - 230,
    y: pageHeight - 50,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});

// Quotation ID - Top left
firstPage.drawText(`Quotation ID: ${createdquotation.idquotation}`, {
    x: margin,
    y: pageHeight - 50,
    size: 20,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});

// Client Info
firstPage.drawText(`Cliente: ${customerName} ${customerLastname}`, {
    x: margin,
    y: pageHeight - 70,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});

firstPage.drawText(`Télefono: ${customerPhoneNumber}`, {
    x: margin,
    y: pageHeight - 90,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});

firstPage.drawText(`Correo: ${customerEmail}`, {
    x: margin,
    y: pageHeight - 110  ,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});


firstPage.drawImage(pdfdesingPatternImage, {
    x: margin,
    y: pageHeight - 290,
    width: 170,
    height: 170,
});



firstPage.drawImage(pdfsimulationImage, {
    x: threeQuarterWidth - (simulatedImageWidth / 2),
    y: pageHeight - 270,
    width: simulatedImageWidth,
    height: simulatedImageHeight,
});

// Design and Colors Details - Right side of the simulation image

let currentDetailsPosition=pageHeight-132;

firstPage.drawText(`Diseños`, {
  x: margin+200,
  y: currentDetailsPosition  ,
  size: fontSize,
  font: helveticaFont,
  color: textColor,
  rotate: rotationAngle,
});

designList.forEach((item, index) => {
  currentDetailsPosition =currentDetailsPosition-15
    firstPage.drawText(item.DesignName, {
        x: margin+200,
        y: currentDetailsPosition,
        size: fontSize,
        font: helveticaFont,
        color: textColor,
        rotate: rotationAngle,
    });
});

currentDetailsPosition-=20;

firstPage.drawText(`Colores`, {
  x: margin+200,
  y: currentDetailsPosition  ,
  size: fontSize,
  font: helveticaFont,
  color: textColor,
  rotate: rotationAngle,
});

designColorsDetails.forEach((item, index) => {
  currentDetailsPosition=currentDetailsPosition-15
    firstPage.drawText(item.DesignColorName, {
        x: margin+200,
        y: currentDetailsPosition,
        size: fontSize,
        font: helveticaFont,
        color: textColor,
        rotate: rotationAngle,
    });
});

// Product Info - Bottom Left
firstPage.drawText(`Sku: ${quotationItemDescription}`, {
    x: margin,
    y: 55,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});

firstPage.drawText(`Unidades: ${cantidadValdosas.toString()}`, {
    x: margin,
    y: 35,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});

firstPage.drawText(`Valor total: ${formatCurrency(parseFloat(data.quotationPrice) + parseFloat(data.quotationPrice * 0.19))}`, {
    x: margin,
    y: 15,
    size: fontSize,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});

// Date - Bottom right
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const fecha = new Date();

firstPage.drawText("Fecha: " + fecha.toLocaleDateString("es-ES", options), {
    x: pageWidth - 250,
    y: 30,
    size: 12,
    font: helveticaFont,
    color: textColor,
    rotate: rotationAngle,
});


// Save the PDF
const pdfBytes = await pdfDoc.save();
console.log("PDF Generated");
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

    let idsysuser;
    let office_idoffice;
    let office={Company_idCompany : 1};

    // If JWT is provided, verify it and extract user info from it
    if(req.headers.jwt!==null && req.headers.jwt!=='null') {
      const token = req.get("JWT");
      try {
        let { user: { idsysuser: id, office_idoffice: officeId, office } } = await promisify(jwt.verify)(token, process.env.SEED);
        idsysuser = id; // Assign extracted values to outer scope variables
        office_idoffice = officeId;
      } catch (error) {
        // Handle error for invalid token
        console.error("Invalid Token: ", error);
        return res.status(401).json({
          status: false,
          err: {
            message: "Invalid Token",
          },
        });
      }
    }

    // If user info is not set, assign default values
    if (!idsysuser) {
      idsysuser = 1;
      office_idoffice = 1;
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
