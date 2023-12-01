const designColorInBundleModel = require('../models/designColorInBundle.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllDesignColorInBundleBreaker = CircuitBreakerHandler.createBreaker(designColorInBundleModel.getAllDesignColorInBundle);
const createDesignColorInBundleBreaker = CircuitBreakerHandler.createBreaker(designColorInBundleModel.createDesignColorInBundle);
const deleteDesignColorInBundleBreaker = CircuitBreakerHandler.createBreaker(designColorInBundleModel.deleteDesignColorInBundle);

exports.getAllDesignColorInBundle = async(req, res) => {
    try {

        const designColorInBundle = await getAllDesignColorInBundleBreaker.fire();
        AnswerManager.handleSuccess(res, designColorInBundle)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createDesignColorInBundle = async(req, res) => {
    try {

        const createdDesignColorInBundle = await createDesignColorInBundleBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdDesignColorInBundle, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
exports.deleteDesignColorInBundle = async (req, res) => {
    try {

      const idDesignColorBundle = req.body.DesignColorBundle_idDesignColorBundle;
      const idDesignColors = req.body.DesignColors_idDesignColors

      await deleteDesignColorInBundleBreaker.fire(parseInt(idDesignColorBundle), parseInt(idDesignColors));

      console.log(idDesignColorBundle, idDesignColors)

      AnswerManager.handleSuccess(res, null, 'DesignColorInBundle deleted successfully');

    } catch (error) {

      error.printMessage = "Couldn't delete DesignColorInBundle";
      AnswerManager.handleError(res, error);

    }
  };
  
