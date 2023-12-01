const designColorBundleModel = require('../models/designColorBundle.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const { number } = require('joi');
const ErrorCodesEnum = require('../structs/Errors/ErrorCodesEnum');



const getAllDesignColorBundleBreaker = CircuitBreakerHandler.createBreaker(designColorBundleModel.getAllDesignColorBundles);
const createDesignColorBundleBreaker = CircuitBreakerHandler.createBreaker(designColorBundleModel.createDesignColorBundle);
const updateDesignColorBundleBreaker = CircuitBreakerHandler.createBreaker(designColorBundleModel.updateDesignColorBundle);
const deleteDesignColorBundleBreaker = CircuitBreakerHandler.createBreaker(designColorBundleModel.deleteDesignColorBundle);
const getAllDesignColorBundleByFiltersBreaker = CircuitBreakerHandler.createBreaker(designColorBundleModel.getAllDesignColorBundleByFilters);

exports.getAllDesignColorBundles = async(req, res) => {
    try {

        const designColorBundle = await getAllDesignColorBundleBreaker.fire();
        AnswerManager.handleSuccess(res, designColorBundle)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createDesignColorBundle = async(req, res) => {
    try {

        const createdDesignColorBundle = await createDesignColorBundleBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdDesignColorBundle, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
exports.updateDesignColorBundle = async (req, res) => {
    try {

      const id = req.params.id
      const data = req.body
      const updatedDesignColorBundle = await updateDesignColorBundleBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedDesignColorBundle, 'design color updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
};

exports.deleteDesignColorBundle = async (req, res) => {
    try {

      const id = req.params.id;
      await deleteDesignColorBundleBreaker.fire(id);

      AnswerManager.handleSuccess(res, null, 'DesignColorBundle deleted successfully');

    } catch (error) {

      error.printMessage = "Couldn't delete DesignColorBundle";
      AnswerManager.handleError(res, error);
      
    }
};

exports.getAllDesignColorBundleByFilters = async (req, res) => {
  try {
    
    const idDesignType = req.body.DesignType_idDesignType;
    const idDesignColor = req.body.DesignColorType_idDesignColorType;
    const idEnvironment = req.body.EnvironmentType_idEnvironmentType;

    const designColorBundle = await getAllDesignColorBundleByFiltersBreaker.fire(parseInt(idDesignType),parseInt(idDesignColor), parseInt(idEnvironment));

    console.log(designColorBundle);

    if (designColorBundle) {
      
      AnswerManager.handleSuccess(res, designColorBundle);

    } else {

      const error = { status: ErrorCodesEnum.NOT_FOUND, printMessage: "design color bundle configuration not found" };
     
      AnswerManager.handleError(res, error);

    }
    console.log(designColorBundle, idDesignType, idDesignColor, idEnvironment)


  } catch (error) {

    console.log(error);
    error.printMessage = "Couldn't get the design color bundle by filters";
    AnswerManager.handleError(res, error);

  }
};