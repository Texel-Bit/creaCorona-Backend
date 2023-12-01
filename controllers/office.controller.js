const officeModel = require('../models/office.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllOfficeBreaker = CircuitBreakerHandler.createBreaker(officeModel.getAllOffice);
const createOfficeBreaker = CircuitBreakerHandler.createBreaker(officeModel.createOffice);
const updateOfficeBreaker = CircuitBreakerHandler.createBreaker(officeModel.updateOffice);
const getAllOfficesByCompanyId = CircuitBreakerHandler.createBreaker(officeModel.getAllOfficesByCompanyId);
const getAllOfficeStatusBreaker = CircuitBreakerHandler.createBreaker(officeModel.getAllOfficeStatus);
const setOfficeStatusBreaker = CircuitBreakerHandler.createBreaker(officeModel.setOfficeStatus);

exports.getAllOffice = async(req, res) => {
    try {

        const office = await getAllOfficeBreaker.fire();
        AnswerManager.handleSuccess(res, office)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createOffice = async(req, res) => {
    try {

        const createdOffice = await createOfficeBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdOffice, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateOffice = async (req, res) => {
    try {

      const id = req.params.id
      const data = req.body
      const updatedOffice = await updateOfficeBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedOffice, 'design color updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
  };

  exports.getAllOfficesByCompanyId = async (req, res) => {
    try {

      const id = req.params.id;
      offices = await getAllOfficesByCompanyId.fire(id)

      if (offices) {

        AnswerManager.handleSuccess(res, offices);
      } else {

        error.printMessage = "Couldn't find offices";
        AnswerManager.handleError(res, error)
      }


    } catch (error) {

      console.log(error)
      error.printMessage = "Couldn't fetch offices";
      console.log(error)
      AnswerManager.handleError(res, error);
    }
  }

  exports.getAllOfficeStatus = async (req, res) => {
    try {

      const id = req.params.id;
      offices = await getAllOfficeStatusBreaker.fire()

      if (offices) {

        AnswerManager.handleSuccess(res, offices);
      } else {

        error.printMessage = "Couldn't find offices";
        AnswerManager.handleError(res, error)
      }


    } catch (error) {

      console.log(error)
      error.printMessage = "Couldn't fetch offices";
      console.log(error)
      AnswerManager.handleError(res, error);
    }
  }
    
  exports.setOfficeStatus = async (req, res) => {

    try {

      const id = req.params.id;
      const data = req.body;
      
      const updatedOffice = await setOfficeStatusBreaker.fire(id, data);
      console.log(updatedOffice)
      AnswerManager.handleSuccess(res, updatedOffice, 'Office updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update Office";

      AnswerManager.handleError(res, error);

    }
};
