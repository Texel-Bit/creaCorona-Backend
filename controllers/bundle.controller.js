const bundleModel = require('../models/bundle.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllBundlesBreaker = CircuitBreakerHandler.createBreaker(bundleModel.getAllBundles);
const createBundleBreaker = CircuitBreakerHandler.createBreaker(bundleModel.createBundle);
const updateBundleBreaker = CircuitBreakerHandler.createBreaker(bundleModel.updateBundle);

exports.getAllBundles = async(req, res) => {
    try {

        const bundle = await getAllBundlesBreaker.fire();
        AnswerManager.handleSuccess(res, bundle)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createBundle = async(req, res) => {
    try {

        const createdBundle = await createBundleBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdBundle, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateBundle = async (req, res) => {
    try {

      const id = req.params.id
      const data = req.body
      const updatedBundle = await updateBundleBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedBundle, 'bundle updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update bundle";

      AnswerManager.handleError(res, error);

    }
  };
  
