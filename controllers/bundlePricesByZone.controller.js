const bundlePricesByZoneModel = require('../models/bundlePricesByZone.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');

const getAllBundlePricesByZoneBreaker = CircuitBreakerHandler.createBreaker(bundlePricesByZoneModel.getAllBundlePricesByZone)
const updateBundlePricesByZoneBreaker = CircuitBreakerHandler.createBreaker(bundlePricesByZoneModel.updateBundlePriceByZone)

exports.getAllBundlePricesByZone = async (req, res) => {
    try {

        const bundlePricesZone = await getAllBundlePricesByZoneBreaker.fire()
        AnswerManager.handleSuccess(res, bundlePricesZone)

    } catch (error) {

        AnswerManager.handleError(res, error);
        console.log(error)
    }
}

exports.updateBundlePriceByZone = async (req, res) => {
    try {

        const id = req.params.id
        const data = req.body

        const pricesByZone = updateBundlePricesByZoneBreaker.fire(id, data)

        AnswerManager.handleSuccess(res, pricesByZone)
        
    } catch (error) {

        AnswerManager.handleError(res, error)
        console.log(error)
    }
}