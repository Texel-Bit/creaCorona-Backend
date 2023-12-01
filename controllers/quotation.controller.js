const quotationModel = require('../models/quotation.model');
const circuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const jwt = require("jsonwebtoken");
const { validateJWT, authenticateJWT } = require('../middlewares/authMiddleware');
const formatSizeTextureModel = require('../models/formatSizeTexture.model');
const stateModel = require('../models/state.model')
const settingsModel = require('../models/settings.model')
const bundleModel = require('../models/bundle.model')
const sysUserModel = require('../models/sysUser.model')
const companyModel = require('../models/company.model')
const bundlePricesByZoneModel = require('../models/bundlePricesByZone.model')
const bundleCompanyPriceModel = require('../models/bundleCompanyPrice.model')


const getAllQuotationBreaker = circuitBreakerHandler.createBreaker(quotationModel.getAllQuotation);
const updateQuotationStatusBreaker = circuitBreakerHandler.createBreaker(quotationModel.updateQuotationStatus);
const createQuotationBreaker = circuitBreakerHandler.createBreaker(quotationModel.createQuotation);

exports.getAllQuotation = async(req, res) => {
    try {

        const quotation = await getAllQuotationBreaker.fire();
        AnswerManager.handleSuccess(res, quotation)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
};

exports.updateQuotationStatus = async (req, res) => {
    try {

        const id = req.params.id;
        const data = req.body;

        const quotationStatus = updateQuotationStatusBreaker.fire(id, data);

        AnswerManager.handleSuccess(res, quotationStatus)

    } catch (error) {

        AnswerManager.handleError(res, error)
    }
}

exports.createQuotation = async (req, res) => {
    try {

        let user;
        // If JWT is provided, verify it and extract user info from it
        if(req.user !== null) {
            console.log(req.user)
            user = req.user
         
        } else {

            user = {
                idsysuser: 1,
                office_idoffice: 1
            }
        }


        const data = req.user

        console.log(data)

        
        let costumerName = req.body.customerName;
        const customerLastname = req.body.customerLastname;
        const customerEmail = req.body.customerEmail;
        const customerPhoneNumber = req.body.customerPhoneNumber;
        let quotationWidth = req.body.quotationWidth;
        let quotationHeight = req.body.quotationHeight;
        let idbrecha = req.body.brecha_idbrecha;
        let idFormatSizeTexture = req.body.FormatSizeTexture_idFormatSizeTexture;
        let idFormatSize = req.body.DesignTypeFormatSize_idDesignTypeFormatSize;
        let quatitionArea = req.body.quatitionArea;
        const idstate = req.body.idstate;
        const simulationImage = req.body.simulationImage;
        const desingPatternImage = req.body.desingPatternImage
         
            // idbundleCompanyPrice

            if (!idFormatSizeTexture) {
                if (idFormatSize) {
                  let defaultFormatSizeTexture = await formatSizeTextureModel.getDefaultFormatSizeTextureById(idFormatSize);
          
                  idFormatSizeTexture = defaultFormatSizeTexture.idFormatSizeTexture;
                }
              }

              if(!idbrecha)
              {
                idbrecha=12;
              }
          
              let quotationPrint= "";

              if(quatitionArea==0) { 

                quatitionArea=Math.round(quotationWidth*quotationHeight*100)/100
                quotationPrint="L: "+quotationWidth+" m       A: "+quotationHeight+" m "+"      Area: "+(quatitionArea)+" m²";

              }
              else {

                quotationPrint="Area: "+Math.round(quatitionArea*100)/100+" m²";
          
              }

              const tileFormatSizeTexture = await formatSizeTextureModel.getDesignTypeFormatSizeByFormatSizeTextureId(idFormatSizeTexture);         

              const tileArea = (tileFormatSizeTexture.DesignTypeFormatSizeHeight * tileFormatSizeTexture.DesignTypeFormatSizeWidht) / 10000;

              const settings = await settingsModel.getCurrentSettings();
              
              const garbage = parseFloat(quatitionArea * settings[0].SystemSetupGarbagePercenttage/100,10)
              
              quatitionArea = parseFloat(quatitionArea,10) +garbage;
              
              let tileAmount = quatitionArea / tileArea 

              const bundle = await bundleModel.getBundleDesignTypeFormatSizeTexture(idFormatSizeTexture);          
          
              const bundleFullData = await bundleModel.getBundleDesignDataByBundleId(bundle);

              const currentUser = await sysUserModel.getSysUserById(data.idsysuser)

              const currentUserOffice = currentUser.office_idoffice

              let company = await companyModel.getCompanyByOfficeId(currentUserOffice)
            
              const state = await stateModel.getStateByOfficeId(currentUserOffice)
              
              const companyZone = state.companyZone_idcompanyZone

              const bundleCompanyPrice = await bundleCompanyPriceModel.getBundleCompanyPrice(bundle.idbundle, companyZone, company.companyType_idcompanyType)

              let bundlePrices = await bundlePricesByZoneModel.getBundlePriceByZone(parseInt(companyZone), parseInt(bundle.idbundle))

              let quotationPrice = Math.round(bundlePrices.price * quatitionArea)

              let companyPrice = parseInt(bundleCompanyPrice.idbundleCompanyPrice)

              console.log(companyPrice)


              const quotationData = {
                customerName: costumerName, // fix the property name here
                customerLastname,
                customerEmail,
                customerPhoneNumber,
                quotationBundlePrice: bundlePrices.price,
                quotationPrice: quotationPrice,
                quotationWidth: quotationWidth,
                quotationHeight: quotationHeight,
                quatitionArea: quatitionArea,
                quotationDate: new Date(),
                FormatSizeTexture_idFormatSizeTexture: idFormatSizeTexture,
                sysUser_idsysuser: data.idsysuser,
                quotationStatus_idquotationStatus: 1,
                simulationImage,
                desingPatternImage,
                quotationCompanyPrice: bundleCompanyPrice.price,
                bundleCompanyPrice_idbundleCompanyPrice: companyPrice
        
            }

              const quotation = await createQuotationBreaker.fire(quotationData)
          

              AnswerManager.handleSuccess(res, quotation)
          

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error)
    }
}

exports.simulateQuotation = async (req, res) => {
    try {

        let user;
        // If JWT is provided, verify it and extract user info from it
        if(req.user !== null) {
            console.log(req.user)
            user = req.user
         
        } else {

            user = {
                idsysuser: 1,
                office_idoffice: 1
            }
        }

        const data = req.user

        if(data)
        {
            data.idsysuser=1;
        }

        console.log(data)

        
        
        let quotationWidth = req.body.quotationWidth;
        let quotationHeight = req.body.quotationHeight;       
        let idFormatSizeTexture = req.body.FormatSizeTexture_idFormatSizeTexture;
        let idFormatSize = req.body.DesignTypeFormatSize_idDesignTypeFormatSize;
        let quatitionArea = req.body.quatitionArea;
        const idstate = req.body.idstate;

         
            // idbundleCompanyPrice

            if (!idFormatSizeTexture) {
                if (idFormatSize) {
                  let defaultFormatSizeTexture = await formatSizeTextureModel.getDefaultFormatSizeTextureById(idFormatSize);
          
                  idFormatSizeTexture = defaultFormatSizeTexture.idFormatSizeTexture;
                }
              }

              if(!idbrecha)
              {
                idbrecha=12;
              }
          
              let quotationPrint= "";

              if(quatitionArea==0) { 

                quatitionArea=Math.round(quotationWidth*quotationHeight*100)/100
                quotationPrint="L: "+quotationWidth+" m       A: "+quotationHeight+" m "+"      Area: "+(quatitionArea)+" m²";

              }
              else {

                quotationPrint="Area: "+Math.round(quatitionArea*100)/100+" m²";
          
              }

              const tileFormatSizeTexture = await formatSizeTextureModel.getDesignTypeFormatSizeByFormatSizeTextureId(idFormatSizeTexture);         

              const tileArea = (tileFormatSizeTexture.DesignTypeFormatSizeHeight * tileFormatSizeTexture.DesignTypeFormatSizeWidht) / 10000;

              const settings = await settingsModel.getCurrentSettings();
              
              const garbage = parseFloat(quatitionArea * settings[0].SystemSetupGarbagePercenttage/100,10)
              
              quatitionArea = parseFloat(quatitionArea,10) +garbage;
              
              let tileAmount = quatitionArea / tileArea 

              const bundle = await bundleModel.getBundleDesignTypeFormatSizeTexture(idFormatSizeTexture);          
          
              const bundleFullData = await bundleModel.getBundleDesignDataByBundleId(bundle);

              const currentUser = await sysUserModel.getSysUserById(data.idsysuser)

              const currentUserOffice = currentUser.office_idoffice

              let company = await companyModel.getCompanyByOfficeId(currentUserOffice)
            
              const state = await stateModel.getStateByOfficeId(currentUserOffice)
              
              const companyZone = state.companyZone_idcompanyZone

              const bundleCompanyPrice = await bundleCompanyPriceModel.getBundleCompanyPrice(bundle.idbundle, companyZone, company.companyType_idcompanyType)

              let bundlePrices = await bundlePricesByZoneModel.getBundlePriceByZone(parseInt(companyZone), parseInt(bundle.idbundle))

              let quotationPrice = Math.round(bundlePrices.price * quatitionArea)

              let companyPrice = parseInt(bundleCompanyPrice.idbundleCompanyPrice)

              console.log(companyPrice)


              const quotationData = {
               
                quotationBundlePrice: bundlePrices.price,
                quotationPrice: quotationPrice,
                quotationWidth: quotationWidth,
                quotationHeight: quotationHeight,
                quatitionArea: quatitionArea,
               
                FormatSizeTexture_idFormatSizeTexture: idFormatSizeTexture,           
              
                quotationCompanyPrice: bundleCompanyPrice.price,
                bundleCompanyPrice_idbundleCompanyPrice: companyPrice,
                tileAmmount:tileAmount
            }

              AnswerManager.handleSuccess(res, quotationData)
          

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error)
    }
}