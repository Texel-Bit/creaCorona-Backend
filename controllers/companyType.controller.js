const companyTypeModel = require('../models/companyType.model');
const circuitBreakerHandler = require('../middlewares/circuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllCompanyTypesBreaker = circuitBreakerHandler.createBreaker(companyTypeModel.getAllCompanyTypes);
const createCompanyTypeBreaker = circuitBreakerHandler.createBreaker(companyTypeModel.createCompanyType);
const updateCompanyTypeBreaker = circuitBreakerHandler.createBreaker(companyTypeModel.updateCompanyType);

exports.getAllCompanyTypes = async(req, res) => {
    try {

        const companyType = await getAllCompanyTypesBreaker.fire();
        AnswerManager.handleSuccess(res, companyType)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createCompanyType = async(req, res) => {
    try {

        const createdCompanyType = await createCompanyTypeBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdCompanyType, req.body);

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateCompanyType = async (req, res) => {
    try {

      const id = req.params.id
      const data = req.body
      const updatedCompanyType = await updateCompanyTypeBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedCompanyType, 'CompanyType updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update CompanyType";

      AnswerManager.handleError(res, error);

    }
  };
  
