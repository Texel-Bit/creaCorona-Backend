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
const { chromium } = require("playwright");

const url = fs.readFileSync(path.join(__dirname, '../pdf/corona.pdf'));

const pngImageBytes = fs.readFileSync(path.join(__dirname, '../pdf/unnamed.png'));





function imageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return 'data:image/png;base64,' + imageBuffer.toString('base64');
}

async function htmlToPdf(htmlContent) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  
  // Set the HTML content to the page
  await page.setContent(htmlContent);

  // Generate PDF from the page content
  const pdfBuffer = await page.pdf({ width: '1920px', height: '1080px' });


  await browser.close();

  // Save the PDF to a file
  require('fs').writeFileSync('mypdf.pdf', pdfBuffer);

  return pdfBuffer;
}



exports.createquotation = async (req, res) => {



  try {
    const token = req.get("JWT");

    let idsysuser;
    let office_idoffice;
    let office={Company_idCompany : 1};
    let userName;
    let lastName;
    let user;

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


     const companyDataEnd=officeData[0];


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

    if(!user)
    {
      user={userName:"crea",lastName:"Corona"};
    }

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
    

    const patternImagePath=path.join(__dirname,"../../", desingPatternImage);
    const designPatternImageBase64 = imageToBase64(patternImagePath);
    
    const simulationImagePath= path.join(__dirname,"../../", simulationImage);
    const simulationImageBase64 = imageToBase64(simulationImagePath);


    console.log("Load Second path ",path.join(__dirname,"../../", simulationImage));

    
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

// // Company Info - Top right
// firstPage.drawImage(pdfPNGLogo, {
//     x: pageWidth - 150,
//     y: pageHeight - 70,
//     width: 100,
//     height: 35,
// });

// firstPage.drawText(company.CompanyNIT, {
//     x: pageWidth - 230,
//     y: pageHeight - 50,
//     size: fontSize,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });

// // Quotation ID - Top left
// firstPage.drawText(`Quotation ID: ${createdquotation.idquotation}`, {
//     x: pageWidth/2,
//     y: pageHeight - 50,
//     size: 20,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });

// // Client Info
// firstPage.drawText(`Cliente: ${customerName} ${customerLastname}`, {
//     x: margin,
//     y: pageHeight - 70,
//     size: fontSize,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });

// firstPage.drawText(`Télefono: ${customerPhoneNumber}`, {
//     x: margin,
//     y: pageHeight - 90,
//     size: fontSize,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });

// firstPage.drawText(`Correo: ${customerEmail}`, {
//     x: margin,
//     y: pageHeight - 110  ,
//     size: fontSize,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });


// firstPage.drawImage(pdfdesingPatternImage, {
//     x: margin,
//     y: pageHeight - 290,
//     width: 170,
//     height: 170,
// });



// firstPage.drawImage(pdfsimulationImage, {
//     x: threeQuarterWidth - (simulatedImageWidth / 2),
//     y: pageHeight - 270,
//     width: simulatedImageWidth,
//     height: simulatedImageHeight,
// });

// // Design and Colors Details - Right side of the simulation image

// let currentDetailsPosition=pageHeight-132;

// firstPage.drawText(`Diseños`, {
//   x: margin+200,
//   y: currentDetailsPosition  ,
//   size: fontSize,
//   font: helveticaFont,
//   color: textColor,
//   rotate: rotationAngle,
// });

// designList.forEach((item, index) => {
//   currentDetailsPosition =currentDetailsPosition-15
//     firstPage.drawText(item.DesignName, {
//         x: margin+200,
//         y: currentDetailsPosition,
//         size: fontSize,
//         font: helveticaFont,
//         color: textColor,
//         rotate: rotationAngle,
//     });
// });

// currentDetailsPosition-=20;

// firstPage.drawText(`Colores`, {
//   x: margin+200,
//   y: currentDetailsPosition  ,
//   size: fontSize,
//   font: helveticaFont,
//   color: textColor,
//   rotate: rotationAngle,
// });

// designColorsDetails.forEach((item, index) => {
//   currentDetailsPosition=currentDetailsPosition-15
//     firstPage.drawText(item.DesignColorName, {
//         x: margin+200,
//         y: currentDetailsPosition,
//         size: fontSize,
//         font: helveticaFont,
//         color: textColor,
//         rotate: rotationAngle,
//     });
// });

// // Product Info - Bottom Left
// firstPage.drawText(`Sku: ${quotationItemDescription}`, {
//     x: margin,
//     y: 55,
//     size: fontSize,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });

// firstPage.drawText(`Unidades: ${cantidadValdosas.toString()}`, {
//     x: margin,
//     y: 35,
//     size: fontSize,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });

// firstPage.drawText(`Valor total: ${formatCurrency(parseFloat(data.quotationPrice) + parseFloat(data.quotationPrice * 0.19))}`, {
//     x: margin,
//     y: 15,
//     size: fontSize,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });

// Date - Bottom right
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const fecha = new Date();

// firstPage.drawText("Fecha: " + fecha.toLocaleDateString("es-ES", options), {
//     x: pageWidth - 250,
//     y: 30,
//     size: 12,
//     font: helveticaFont,
//     color: textColor,
//     rotate: rotationAngle,
// });

const companyData = await getCompanyById(company);

const pdfBytes = await pdfDoc.save();

let designsListHtml="";
designList.forEach((item, index) => {
  designsListHtml+=`<p>${item.DesignName}</p>`
  
  
});



let designColorsHtml="";


designColorsDetails.forEach((item, index) => {

  const imagePath=path.join(__dirname,"../../", item.DesignColorPath);
  const imageBase64=imageToBase64(imagePath);

  designColorsHtml+=` <div class="color-item">
  <img class="color-box" src="${imageBase64}" alt="${item.DesignColorName}"></img>
  <span>${item.DesignColorName}</span>
</div>`
  
  
});

const html=`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0px;
            height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        * {
            margin: 0;
        }

        hr {
            border: 1px solid #00447431;
        }

        /* headers */
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 10vh;
            width: 80%;
            margin: 0 auto;
            position: relative;
        }

        .quotationTitle {
            color: #0069b4;
            margin: 10px 0px 5px 0;
        }

        .dateQuotation {
            font-size: 20px;
            margin: 10px 0px;
            color: #004374
        }

        /* endHeader */

        .InfoContent {
            display: flex;
            justify-content: space-evenly;
            height: 30vh;
            width: 80%;
            margin: 0 auto;
            align-items: flex-start;
        }

        /* diseño y avatares */
        .desingContainerPrincipal,
        .containerColoresCreaCorona,
        .formatAndStucture {
            width: 33%;
        }

        .desingContainerPrincipal {
            display: flex;
            justify-content: center;
            flex-direction: column;
        }


        .desingContainerPrincipal_container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        .desingContainerPrincipal_title {
            color: #004374;
            margin: 5px auto 5px 0;
            font-weight: 700;
        }

        .mosaicContainer {
            display: flex;
            gap: 1rem;
            width: 100%;
        }

        .mosaicImage {
            width: 50%;
        }

        .desingContainerPrincipal_avatars {
            display: flex;
            justify-content: center;
            width: 50%;
            flex-direction: column;
        }

        .desingContainerPrincipal_avatars p {
            margin: 5px 0;
            width: 90%;
            background-color: rgb(223, 223, 223);
            padding: 5px 0;
            text-align: center;
        }

        /* Fin diseño y avatares */


        /*Colores y lista */
        .colors {
            display: flex;
            flex-direction: column;
            width: max-content;
            width: 100%;
        }

        .colorsTitle {
            margin: 5px 0;
        }

        .colorsTitle p {
            margin: 0px;
            color: #004374;
            font-weight: 700;
        }

        .colosList {
            display: flex;
            gap: 10px;
            width: 90%;
            flex-wrap: wrap;
        }

        .color-item {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            position: relative;
        }

        .color-box {
            width: 100px;
            height: 85px;
            background-size: cover;
        }

        .color-item span {
            text-align: center;
            padding: 5px 0;
            background-color: rgba(240, 240, 240, 0.377);
            position: absolute;
            bottom: 0%;
            width: 100%;
        }

        /* Fin colores y lista de colores  */

        /* formato structure & price  */

        .formatAndStucture {
            display: flex;
            flex-direction: column;
            gap: 25px;
            height: 100%;
        }

        .formatAndStucture_format,
        .formatAndStucture_structure {
            display: flex;
            gap: 10px;
        }

        .formatAndStucture_format_title {
            color: #004374;
            font-weight: 700;
        }



        .total {
            margin-top: auto;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            font-size: 24px;
            font-weight: bold;
            width: 100%;
        }

        .unityTotal {
            font-size: 18px;
            margin-bottom: 5px;
            color: #919191;
        }

        .priceTotal {
            color: #004374;
            font-weight: 700;
            font-size: 30px;
        }

        /* finAL DE STRUCTURA Y PRECIO  */


        .InfoContent_two {
            width: 80%;
            margin: 0 auto;
            display: flex;
        }

        .container_imgRender {
            width: 62%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container_imgRender img {
            width: 80%;
        }

        .infoClientContainer {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            width: 38%;
            position: relative;
        }

        .dataCliente {
            color: #004374;
            font-size: 25px;
            margin-bottom: 20px;
        }

        .client-info {
            display: flex;
            flex-direction: column;
            gap: 10px;
            justify-content: center;
            align-items: start;
            width: 100%;
        }

        .containerInformationClient {
            display: flex;
            width: 100%;
        }

        .infoClientTileFinal {
            width: 45%;
            font-weight: 700;
            color: #004374;
        }

        .logoCreaCorona {
            position: absolute;
            width: 150px;
            right: 0%;
            bottom: 0%;
        }
    </style>
</head>

<body>

    <div class="header">
        <div>
            <h1 class="quotationTitle">Cotización #${createdquotation.idquotation}</h1>
            <p class="dateQuotation">Fecha: ${fecha.toLocaleDateString("es-ES", options)}</p>
        </div>
    </div>

    <div class="InfoContent">

        <div class="desingContainerPrincipal">
            <div class="desingContainerPrincipal_container">
                <p class="desingContainerPrincipal_title">Diseño</p>
                <div class="mosaicContainer">
                    <img class="mosaicImage"
                        src="${designPatternImageBase64}"
                        alt="Avatar Design" width="100">
                    <div class="desingContainerPrincipal_avatars">
                        ${designsListHtml}
                    </div>
                </div>

            </div>

        </div>

        <div class="containerColoresCreaCorona">

            <div class="colors">
                <div class="colorsTitle">
                    <p>Colores:</p>
                </div>
                <div class="colosList">
                    ${designColorsHtml}
                </div>

            </div>
        </div>

        <div class="formatAndStucture">
            <hr>
            <h1 class="dataCliente">Datos del producto:</h1>
            <div class="formatAndStucture_format">
                <p class="formatAndStucture_format_title">Formato:</p>
                <p class="formatAndStucture_format_info">${BundleFullData[0].DesignTypeFormatSizeName}</p>
            </div>
            <hr>
            <div class="formatAndStucture_structure">
                <p class="formatAndStucture_format_title">Estructura:</p>
                <p class="formatAndStucture_format_info">${BundleFullData[0].FormatSizeTextureName}</p>
            </div>

        </div>


    </div>


    <div class="InfoContent_two">
        <div class="container_imgRender">
            <img src="${simulationImageBase64}"
                alt="Room Preview">
        </div>


        <div class="infoClientContainer">

            <div class="client-info">
                <hr style="width:100%; margin:10px 0px">
                <h1 class="dataCliente">Datos del cliente:</h1>
                <div class="containerInformationClient">
                    <p class="infoClientTileFinal">Cliente :</p>
                    <p class="infoClientValur">${data.customerName+" "+data.customerLastname}</p>
                </div>
                <div class="containerInformationClient">
                    <p class="infoClientTileFinal">Teléfono :</p>
                    <p class="infoClientValur">${data.customerPhoneNumber}</p>
                </div>
                <div class="containerInformationClient">
                    <p class="infoClientTileFinal">E-mail :</p>
                    <p class="infoClientValur">${data.customerEmail}</p>
                </div>
                <hr style="width:100%; margin:10px 0px">
                <div class="containerInformationClient">
                    <p class="infoClientTileFinal">Nombre de la empresa :</p>
                    <p class="infoClientValur">${companyDataEnd.Company.CompanyName}</p>
                </div>
                <div class="containerInformationClient">
                    <p class="infoClientTileFinal">Nit :</p>
                    <p class="infoClientValur"> ${companyDataEnd.Company.CompanyNIT}</p>
                </div>
                <hr style="width:100%; margin:10px 0px">
                <div class="containerInformationClient">
                    <p class="infoClientTileFinal">Nombre del asesor:</p>
                    <p class="infoClientValur"> ${user.userName} ${user.lastName} </p>
                </div>
                <hr style="width:100%; margin:10px 0px">

            </div>

            <img class="logoCreaCorona"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYgAAADBCAYAAADVYyc2AAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABFASURBVHgB7d1LcFRVHsfxE3kGEh6hRBAUsAiWWkNAFqAzyqNmIy5ABVc6gItxpcCsRqwSnSlxVgq6c8FjdOVrYDFYZZUQBUuoGiGhSqwBS4KiIAiEBBMkPOb+bntj0/mf2/d2Ot3pzPdTlTIk3fcZ/797zzn3dNX9H/103QFwHW2djU0fH5rqADh3zW0c7ABkuT7VAXCuqmrMTQ4AAAMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAABMBAQAwERAAANNgB6DsxlQPdlPGVbtZk0aF/2451+lazna648F/+2L5rZ1d4TqaT7S7vqR1Lphe173OT46eC/57xaWV2fbaYD+GhP/ObHtb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"
                alt="">

            <div class="total">
                <p class="unityTotal">Unidades: ${cantidadValdosas.toString()}</p>
                <p class="priceTotal">Total : ${formatCurrency(parseFloat(data.quotationPrice) + parseFloat(data.quotationPrice * 0.19))}</p>
            </div>
        </div>

    </div>

</body>

</html>`;



fs.writeFileSync('output.html', html, 'utf8', (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('File saved successfully!');
  }
});

const newPdf= await htmlToPdf(html);
// Save the PDF

console.log("PDF Generated");
data.pdfBytes = newPdf;
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

    const companyData = await getCompanyById(company);



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
