const quotationStatusModel = require('../models/quotationStatus.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');


const getAllQuotationStatusBreaker = CircuitBreakerHandler.createBreaker(quotationStatusModel.getAllQuotationStatus);

exports.getAllQuotationStatus = async(req, res) => {
    try {

        const quotationStatus = await getAllQuotationStatusBreaker.fire();
        AnswerManager.handleSuccess(res, quotationStatus)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}