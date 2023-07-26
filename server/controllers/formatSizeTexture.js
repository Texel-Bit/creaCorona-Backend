const {
  createFormatSizeTexture,
  updateFormatSizeTexture,
  getAllFormatSizeTexture,
  getFormatSizeTextureById,
} = require("../models/formatSizeTexture");
const { subirArchivoImagen } = require("../helpers/subirarchivos");
const path = require('path');
const fs = require('fs');


exports.createFormatSizeTexture = async (req, res) => {
  try {
    const { FormatSizeTextureName, idDesignTypeFormatSize } = req.body;
    if (!FormatSizeTextureName || !idDesignTypeFormatSize) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    const image = await subirArchivoImagen(
      req.files.FormatSizeTextureMaskPath,
      "uploads/FormatSizeTexture"
    );

       // Manejo de errores de subirArchivoImagen
       if (!image) {
        return res.status(400).json({
          status: false,
          err: {
            message: "Error al subir la imagen",
          },
        });
      }

    const data = {
      FormatSizeTextureName,
      FormatSizeTextureMaskPath: image,
      DesignTypeFormatSize: {
        connect: { idDesignTypeFormatSize: +idDesignTypeFormatSize },
      },
    };

    const createdFormatSizeTexture = await createFormatSizeTexture(data);

    res.json({
      status: true,
      data: createdFormatSizeTexture,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No pudo ser creado el formato  tamaño textura",
      },
    });
  }
};

exports.updateFormatSizeTexture = async (req, res, next) => {
  try {

  // Desestructurar los campos del cuerpo de la petición
  const {
    idFormatSizeTexture,
    FormatSizeTextureName,
    
    idDesignTypeFormatSize,
  } = req.body;

  if (!idFormatSizeTexture||!FormatSizeTextureName||!idDesignTypeFormatSize) {
    return res.status(400).json({ status: false, err: { message: "Datos de entrada incompletos" } });
  }

  const data = {
    idFormatSizeTexture: +idFormatSizeTexture,
    FormatSizeTextureName,
        DesignTypeFormatSize: {
      connect: { idDesignTypeFormatSize: +idDesignTypeFormatSize },
    },
  };
  const formatSizeTexture = await getFormatSizeTextureById(data);

  if (req.files && req.files.FormatSizeTextureMaskPath) {
    const image = await subirArchivoImagen(
      req.files.FormatSizeTextureMaskPath,
      "uploads/FormatSizeTexture"
    );

    const filePath=path.join(__dirname,formatSizeTexture.FormatSizeTextureMaskPath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync();
    }    data.FormatSizeTextureMaskPath = image;
  }  
  
  const result = await updateFormatSizeTexture(data);

  res.json({ status: true, data: result });
} catch (error) {

  res.status(500).json({ status: false, error });
}

};

exports.getAllFormatSizeTexture = async (req, res) => {
  try {
    const allFormatSizeTexture = await getAllFormatSizeTexture();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allFormatSizeTexture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las allFormatSizeTexture",
    });
  }
};


exports.castHtmlToPng = async (req, res) => {


  const htmlContent = Buffer.from(req.body.svgsContent, 'base64').toString('utf8');
  const BrowserWidth=req.body.width;
  const BrowserHeight=req.body.height;

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: {
      width: BrowserWidth,
      height: BrowserHeight,
    },
    
  });
  const page = await context.newPage();
  
  const html = `<html>
                <body>
                ${htmlContent}
                </body>
                </html>`;
  
                console.log(html);
  await page.setContent(html);
  
  // Since you want to screenshot the full page, you might not need to set the viewport size
  // but it's here in case you want to control the dimensions of the page.
  await page.setViewportSize({ width: BrowserWidth, height: BrowserHeight });
  
  // take a screenshot of the full page
  const screenshotBuffer = await page.screenshot({ path: 'screenshot.jpeg', type: 'jpeg', fullPage: true });
  
  await browser.close();
  
  const screenshotUrl = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;
  res.send(screenshotUrl);
  

/*
  console.log("Servie");

  
  try {
    

    const htmlContent = Buffer.from(req.body.svgsContent, 'base64').toString('utf8');

   

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

  // Establecer el tamaño de la ventana del navegador para que coincida con el contenido SVG
    await page.setViewport({ width: req.body.width, height: req.body.height });

     // Cargar el contenido SVG en el navegador
     await page.setContent(`<html><body>${htmlContent}</body></html>`, { waitUntil: 'domcontentloaded' });

     console.log(`<html><body>${htmlContent}</body></html>`);

     
     // Capturar una captura de pantalla del contenido SVG
    const screenshotBuffer = await page.screenshot({ type: 'png' ,fullPage: true});

    await browser.close();

        // Convertir el buffer de la captura de pantalla a base64 URL
    const screenshotUrl = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;
    res.send(screenshotUrl);
    
    

  } catch (error) {
    console.error(error," ERROOOR ");
    res.status(500).send({
      message: "No se pudo obtener las allFormatSizeTexture",
    });
  }

  */

};
//sin uso
