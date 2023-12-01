const designCompanyModel = require('../models/designCompany.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllDesignCompanyBreaker = CircuitBreakerHandler.createBreaker(designCompanyModel.getAllDesignCompany);
const createDesignCompanyBreaker = CircuitBreakerHandler.createBreaker(designCompanyModel.createDesignCompany);
const updateDesignCompanyBreaker = CircuitBreakerHandler.createBreaker(designCompanyModel.updateDesignCompany);

exports.getAllDesignCompany = async(req, res) => {
    try {

        const designCompany = await getAllDesignCompanyBreaker.fire();
        AnswerManager.handleSuccess(res, designCompany)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createDesignCompany = async(req, res) => {
    try {

        const createdDesignCompany = await createDesignCompanyBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdDesignCompany, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateDesignCompany = async (req, res) => {
    try {

      const idCompany = req.body.Company_idCompany
      const idDesign = req.body.Design_idDesign 
      const data = req.body.DesignCompanyBuyPrice

      const updatedDesignCompany = await updateDesignCompanyBreaker.fire(parseInt(idCompany), parseInt(idDesign), parseFloat(data));

      AnswerManager.handleSuccess(res, updatedDesignCompany, 'design company updated successfully');

      console.log("sdgfg", idCompany, idDesign, data)

    } catch (error) {

      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
  };
  
