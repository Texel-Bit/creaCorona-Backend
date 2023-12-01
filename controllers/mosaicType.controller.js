const mosaicTypeModel = require('../models/mosaicType.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllMosaicTypeBreaker = CircuitBreakerHandler.createBreaker(mosaicTypeModel.getAllMosaicTypes);
const createMosaicTypeBreaker = CircuitBreakerHandler.createBreaker(mosaicTypeModel.createMosaicType);
const updateMosaicTypeBreaker = CircuitBreakerHandler.createBreaker(mosaicTypeModel.updateMosaicType);

exports.getAllMosaicTypes = async(req, res) => {
    try {

        const mosaicTypes = await getAllMosaicTypeBreaker.fire();
        AnswerManager.handleSuccess(res, mosaicTypes)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createMosaicType = async(req, res) => {
    try {

        const createdMosaicType = await createMosaicTypeBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdMosaicType, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}

  exports.updateMosaicType = async (req, res) => {
    try {

      const id = req.params.id
      const data = req.body
      const updatedMosaicType = await updateMosaicTypeBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedMosaicType, 'mosaic type updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update mosaic type";

      AnswerManager.handleError(res, error);

    }
  };