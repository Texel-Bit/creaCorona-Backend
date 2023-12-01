const bundleCompanyPriceModel = require('../models/bundleCompanyPrice.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllBundleCompanyPricesBreaker = CircuitBreakerHandler.createBreaker(bundleCompanyPriceModel.getAllBundleCompanyPrices);
const getAllBundleCompanyPricesByFormatSizeTextureBreaker = CircuitBreakerHandler.createBreaker(bundleCompanyPriceModel.getAllBundleCompanyPriceByFormatSizeTexture);
const createBundleCompanyPriceBreaker = CircuitBreakerHandler.createBreaker(bundleCompanyPriceModel.createBundleCompanyPrice);
const updateBundleCompanyPriceBreaker = CircuitBreakerHandler.createBreaker(bundleCompanyPriceModel.updateBundleCompanyPrice);

exports.getAllBundleCompanyPrices = async(req, res) => {
    try {

        const bundleCompanyPrice = await getAllBundleCompanyPricesBreaker.fire();
        AnswerManager.handleSuccess(res, bundleCompanyPrice)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.getAllBundleCompanyPricesByFormatSizeTexture = async(req, res) => {
  try {

      const id = req.params.id
      const bundleCompanyPrice = await getAllBundleCompanyPricesByFormatSizeTextureBreaker.fire(id);
      AnswerManager.handleSuccess(res, bundleCompanyPrice)

  } catch (error) {

      console.log(error)
      AnswerManager.handleError(res, error);

  }
}


exports.createBundleCompanyPrice = async(req, res) => {
    try {

        const createdBundleCompanyPrice = await createBundleCompanyPriceBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdBundleCompanyPrice, req.body);

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateBundleCompanyPrice = async (req, res) => {
    try {

      const id = req.params.bundleId
      const data = req.body
      const updatedBundleCompanyPrice = await updateBundleCompanyPriceBreaker.fire(id, data);

      console.log("Aidis "+id)
      AnswerManager.handleSuccess(res, updatedBundleCompanyPrice, 'bundleCompanyPrice updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update bundleCompanyPrice";

      AnswerManager.handleError(res, error);

    }
  };
  
exports.getBundleCompanyPriceByFormatZiseTexture = async (req, res) => {
  try {

    const idFormatSize = req.body.FormatSizeTexture_idFormatSizeTexture;

    const companyPrice = await getBundleCompanyPriceByFormatZiseTextureBreaker.fire(idFormatSize);

    if (companyPrice) {

      AnswerManager.handleSuccess(res, companyPrice)

    } else {

      AnswerManager.handleError(res, error, 'Bunlde company price not found')
    }

  } catch (error) {

    AnswerManager.handleError(res, error)
  }
}