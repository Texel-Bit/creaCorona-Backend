const formatSizeTextureModel = require('../models/formatSizeTexture.model');
const bundleModel = require('../models/bundle.model');
const zonesModel = require('../models/companyZone.model');
const companyTypeModel = require('../models/companyType.model');
const companyZoneModel = require('../models/companyZone.model');
const companyPriceModel = require('../models/bundleCompanyPrice.model');


const circuitBreakerHandler = require('../middlewares/circuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');


const getAllFormatSizeTextureBreaker = circuitBreakerHandler.createBreaker(formatSizeTextureModel.getAllFormatSizeTexture);
const getAllFormatSizeTextureByFormatSizeIdBreaker = circuitBreakerHandler.createBreaker(formatSizeTextureModel.getAllFormatSizeTextureByFormatSizeId);
const createFormatSizeTextureBreaker = circuitBreakerHandler.createBreaker(formatSizeTextureModel.createFormatSizeTexture);
const createBundleBreaker = circuitBreakerHandler.createBreaker(bundleModel.createBundle);
const updateFormatSizeTextureBreaker = circuitBreakerHandler.createBreaker(formatSizeTextureModel.updateFormatSizeTexture);
const setFormatSizeTextureStatusBreaker = circuitBreakerHandler.createBreaker(formatSizeTextureModel.setFormatSizeTextureStatus);
const getAllCompanyTypesBreaker = circuitBreakerHandler.createBreaker(companyTypeModel.getAllCompanyTypes);
const getAllZonesBreaker = circuitBreakerHandler.createBreaker(companyZoneModel.getAllCompanyZones);
const createBundlePriceBreaker = circuitBreakerHandler.createBreaker(companyPriceModel.createManyBundlesCompanyPrice);


const sharp = require('sharp');
const lzString = require('lz-string');
const { chromium } = require('playwright');

exports.getAllFormatSizeTexture = async(req, res) => {
    try {

        const formatSizeTexture = await getAllFormatSizeTextureBreaker.fire();
        AnswerManager.handleSuccess(res, formatSizeTexture)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.getAllFormatSizeTextureByFormatSizeId = async(req, res) => {
  try {

      const {formatSizeId}=req.params;

      console.log(formatSizeId)

      const formatSizeTexture = await getAllFormatSizeTextureByFormatSizeIdBreaker.fire(formatSizeId);
      AnswerManager.handleSuccess(res, formatSizeTexture)

  } catch (error) {

      console.log(error)
      AnswerManager.handleError(res, error);

  }
}

exports.createFormatSizeTexture = async(req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.FormatSizeTextureName,   
        "FormatSizeTextures")
        
        
      let data = {
          FormatSizeTextureName: req.body.FormatSizeTextureName,
          DesignTypeFormatSize_idDesignTypeFormatSize: parseInt(req.body.DesignTypeFormatSize_idDesignTypeFormatSize),
      }
      if(imagePath)
      {
          data.FormatSizeTextureMaskPath=imagePath;
      }

        const createdformatSizeTexture = await createFormatSizeTextureBreaker.fire(data);
        
        console.log(createdformatSizeTexture)

        const bundleData={
          bundleBasePrice:0,
          FormatSizeTexture_idFormatSizeTexture:createdformatSizeTexture.idFormatSizeTexture
        }

        console.log("Bundle  Data "+bundleData)

        const bundle= await createBundleBreaker.fire(bundleData);

        const bundleId=bundle.idbundle;
        
        const companyTypes=await getAllCompanyTypesBreaker.fire();
        const companyZones=await getAllZonesBreaker.fire();
        

        let bundlePriceData = [];

        companyZones.forEach(zone => {
            companyTypes.forEach(type => {
                let record = {
                    bundle_idbundle: bundleId,
                    companyZone_idcompanyZone: zone.idcompanyZone,
                    companyType_idcompanyType: type.idcompanyType,
                    price:0
                };
                bundlePriceData.push(record);
            });
        });

        await createBundlePriceBreaker.fire(bundlePriceData);

        AnswerManager.handleSuccess(res, createdformatSizeTexture, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateFormatSizeTexture = async (req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.FormatSizeTextureName,   
        "FormatSizeTextures")
        
        
      let data = {
          FormatSizeTextureName: req.body.FormatSizeTextureName,
          DesignTypeFormatSize_idDesignTypeFormatSize: parseInt(req.body.DesignTypeFormatSize_idDesignTypeFormatSize),
      }
      if(imagePath)
      {
          data.FormatSizeTextureMaskPath=imagePath;
      }     
      
      const id = req.params.id
      const updatedformatSizeTexture = await updateFormatSizeTextureBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedformatSizeTexture, 'design color updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
  };
  
  exports.setFormatSizeTextureStatus = async (req, res) => {

    try {

      const id = req.params.id;
      const data = req.body;
      
      const updatedFormatSizeTexture = await setFormatSizeTextureStatusBreaker.fire(id, data);
      console.log(updatedFormatSizeTexture)
      AnswerManager.handleSuccess(res, updatedFormatSizeTexture, 'FormatSizeTexture updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update FormatSizeTexture";

      AnswerManager.handleError(res, error);

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