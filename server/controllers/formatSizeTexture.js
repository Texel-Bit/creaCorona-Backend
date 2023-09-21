const {
  createFormatSizeTexture,
  updateFormatSizeTexture,
  getAllFormatSizeTexture,
  getFormatSizeTextureById,
} = require("../models/formatSizeTexture");
const { subirArchivoImagen } = require("../helpers/subirarchivos");
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const lzString = require('lz-string');
const { chromium } = require('playwright');

exports.createFormatSizeTexture = async (req, res) => {
  console.log(req.body)
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

let browser;

async function getBrowserInstance() {
  if (!browser) {
    browser = await chromium.launch();
  }
  return browser;
}


exports.castHtmlToPng = async (req, res) => {
  console.log("Html to png");
  try {
    // Decompress SVG content from the request
    const decompressedSvg = lzString.decompressFromBase64(req.body.svgsContent);
    const BrowserWidth = req.body.width;
    const BrowserHeight = req.body.height;

    const browser = await getBrowserInstance();
    const context = await browser.newContext({
      viewport: {
        width: BrowserWidth,
        height: BrowserHeight,
      },
    });

    const page = await context.newPage();

    // Use decompressed SVG content here
    const html = `<html>
                  <head>
                    <style>
                      html, body {
                        margin: 0;
                        padding: 0;
                      }
                    </style>
                  </head>
                  <body>
                    ${decompressedSvg}
                  </body>
                </html>`;

    await page.setContent(html);
    await page.setViewportSize({ width: BrowserWidth, height: BrowserHeight });
  
    const screenshotBuffer = await page.screenshot({ type: 'png', fullPage: true });

    const compressedBuffer = await sharp(screenshotBuffer)
      .resize({ width: BrowserWidth, height: BrowserHeight }) // optional resizing
      .png({ quality: 80 }) // adjust quality
      .toBuffer();

    await page.close(); // Close the page, not the browser, to reuse the browser instance

    const screenshotUrl = `data:image/png;base64,${compressedBuffer.toString('base64')}`;

    res.status(200).json({ status: true, data: screenshotUrl });
  } catch (error) {
    console.error('Error while converting HTML to PNG:', error);
    res.status(400).json({ status: false, error });
  }
};
//sin uso
