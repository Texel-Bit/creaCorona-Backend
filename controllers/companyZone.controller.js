const companyZoneModel = require('../models/companyZone.model');
const companyPriceModel = require('../models/bundleCompanyPrice.model');
const companyTypeModel = require('../models/companyType.model');
const bundleModel = require('../models/bundle.model');


const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllCompanyZonesBreaker = CircuitBreakerHandler.createBreaker(companyZoneModel.getAllCompanyZones);
const getAllCompanyStatusBreaker = CircuitBreakerHandler.createBreaker(companyZoneModel.getAllCompanyStatus);
const createCompanyZoneBreaker = CircuitBreakerHandler.createBreaker(companyZoneModel.createCompanyZone);
const updateCompanyZoneBreaker = CircuitBreakerHandler.createBreaker(companyZoneModel.updateCompanyZone);

const getAllCompanyTypesBreaker = CircuitBreakerHandler.createBreaker(companyTypeModel.getAllCompanyTypes);
const getAllCompanyBundlesBreaker = CircuitBreakerHandler.createBreaker(bundleModel.getAllBundles);
const createBundlePriceBreaker = CircuitBreakerHandler.createBreaker(companyPriceModel.createManyBundlesCompanyPrice);
const setCompanyZoneStatusBreaker = CircuitBreakerHandler.createBreaker(companyZoneModel.setCompanyZoneStatus);



exports.getAllCompanyZones = async(req, res) => {
    try {

        const companyZone = await getAllCompanyZonesBreaker.fire();
        AnswerManager.handleSuccess(res, companyZone)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.getAllCompanyStatus = async(req, res) => {
  try {

      const companyZone = await getAllCompanyStatusBreaker.fire();
      AnswerManager.handleSuccess(res, companyZone)

  } catch (error) {

      console.log(error)
      AnswerManager.handleError(res, error);

  }
}

exports.createCompanyZone = async(req, res) => {
    try {

        const createdCompanyZone = await createCompanyZoneBreaker.fire(req.body);
        
        const companyTypes=await getAllCompanyTypesBreaker.fire();
        const bundles=await getAllCompanyBundlesBreaker.fire();
        

        let bundlePriceData = [];

        bundles.forEach(bundle => {
            companyTypes.forEach(type => {
                let record = {
                    bundle_idbundle: bundle.idbundle,
                    companyZone_idcompanyZone: createdCompanyZone.idcompanyZone,
                    companyType_idcompanyType: type.idcompanyType,
                    price:0
                };
                bundlePriceData.push(record);
            });
        });

        await createBundlePriceBreaker.fire(bundlePriceData);
        
        AnswerManager.handleSuccess(res, createdCompanyZone, req.body);

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateCompanyZone = async (req, res) => {
    try {

      const id = req.params.id
      const data = req.body
      const updatedCompanyZone = await updateCompanyZoneBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedCompanyZone, 'CompanyZone updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update CompanyZone";

      AnswerManager.handleError(res, error);

    }
  };
  
  exports.setCompanyZoneStatus = async (req, res) => {

    try {

      const id = req.params.id;
      const data = req.body;
      
      const updatedCompanyZone = await setCompanyZoneStatusBreaker.fire(id, data);
      console.log(updatedCompanyZone)
      AnswerManager.handleSuccess(res, updatedCompanyZone, 'CompanyZone updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update CompanyZone";

      AnswerManager.handleError(res, error);

    }
};
