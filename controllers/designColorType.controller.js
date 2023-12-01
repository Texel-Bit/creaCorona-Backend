const designColorTypeModel = require('../models/designColorType.model');
const circuitBreakerHandler = require('../middlewares/circuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const ErrorCodesEnum = require('../structs/Errors/ErrorCodesEnum');


const getAllDesignColorTypeBreaker = circuitBreakerHandler.createBreaker(designColorTypeModel.getAllDesignColorType);
const createDesignColorTypehasDesignTypeBreaker = circuitBreakerHandler.createBreaker(designColorTypeModel.createDesignColorTypehasDesignType);
const deleteDesignColorTypehasDesignTypeBreaker = circuitBreakerHandler.createBreaker(designColorTypeModel.deleteDesignColorTypehasDesignType);
const getDesignColorTypeByDesignTypeBreaker = circuitBreakerHandler.createBreaker(designColorTypeModel.getDesignColorTypeByDesignType);
const getAllDesignColorTypehasDesignTypeBreaker = circuitBreakerHandler.createBreaker(designColorTypeModel.getAllDesignColorTypehasDesignType);

exports.getAllDesignColorType = async(req, res) => {
    try {

        const designColorType = await getAllDesignColorTypeBreaker.fire();
        AnswerManager.handleSuccess(res, designColorType)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.getAllDesignColorTypehasDesignType = async(req, res) => {
    try {

        const designColorType = await getAllDesignColorTypehasDesignTypeBreaker.fire();
        AnswerManager.handleSuccess(res, designColorType)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createDesignColorTypehasDesignType = async(req, res) => {
    try {

        const createdDesignColorTypehasDesignType = await createDesignColorTypehasDesignTypeBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdDesignColorTypehasDesignType, req.body);
        console.log(req.body)
    } catch (error) { 

        AnswerManager.handleError(res, error);
    }
}
  
exports.deleteDesignColorTypehasDesignType = async (req, res) => {
    try {

      const EnvironmentType_idEnvironmentType = req.body.EnvironmentType_idEnvironmentType;
      const DesignType_idDesignType = req.body.DesignType_idDesignType;
      const DesignColorType_idDesignColorType = req.body.DesignColorType_idDesignColorType;
      
      await deleteDesignColorTypehasDesignTypeBreaker.fire(EnvironmentType_idEnvironmentType, DesignType_idDesignType, DesignColorType_idDesignColorType);

      AnswerManager.handleSuccess(res, null, 'DesignColorType deleted successfully');

    } catch (error) {

      error.printMessage = "Couldn't delete DesignColorType";
      AnswerManager.handleError(res, error);

    }
  };

exports.getDesignColorTypeByDesignType = async (req, res) => {
    try {

        const id = req.params.id;
        console.log(id)
        const designColorType = await getDesignColorTypeByDesignTypeBreaker.fire(parseInt(id));
        console.log(designColorType);

        if (designColorType) {

            AnswerManager.handleSuccess(res, designColorType)

        } else {

            const error = { status: ErrorCodesEnum.NOT_FOUND, printMessage: "design color type not found" };
            AnswerManager.handleError(res, error);
            console.log(error);

        }


    } catch (error) {

        console.log(error)
        error.printMessage = "Couldn't fetch the design color";
        AnswerManager.handleError(res, error);

    }
}
  
