const stateModel = require('../models/state.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const { Prisma } = require('@prisma/client');


const getAllStateBreaker = CircuitBreakerHandler.createBreaker(stateModel.getAllStates);
const createStateBreaker = CircuitBreakerHandler.createBreaker(stateModel.createState);
const updateStateBreaker = CircuitBreakerHandler.createBreaker(stateModel.updateState);
const deleteStateBreaker = CircuitBreakerHandler.createBreaker(stateModel.deleteState);
const setStateStatusBreaker = CircuitBreakerHandler.createBreaker(stateModel.setStateStatus);


exports.getAllStates = async(req, res) => {
    try {

        const state = await getAllStateBreaker.fire();
        AnswerManager.handleSuccess(res, state, req.body)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createState = async(req, res) => {
    try {

        const createdState = await createStateBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdState, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
exports.updateState = async (req, res) => {
    try {

      const id = req.params.id
      const data = req.body
      const updatedState = await updateStateBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedState, 'design color updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
};

exports.deleteState = async (req, res) => {
    try {

      const id = req.params.id;
      await deleteStateBreaker.fire(id);

      AnswerManager.handleSuccess(res, null, 'State deleted successfully');

    } catch (error) {

      error.printMessage = "Couldn't delete State";
      AnswerManager.handleError(res, error);
      
    }
};

exports.setStateStatus = async (req, res) => {

  try {

    const id = req.params.id;
    const data = req.body;
    
    const updatedState = await setStateStatusBreaker.fire(id, data);
    console.log(updatedState)
    AnswerManager.handleSuccess(res, updatedState, 'State updated successfully');

  } catch (error) {
    console.log(error)
    error.printMessage = "Couldn't update State";

    AnswerManager.handleError(res, error);

  }
};

