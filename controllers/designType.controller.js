const designTypeModel = require('../models/designType.model');
const circuitBreakerHandler = require('../middlewares/circuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');


const getAllDesignTypeBreaker = circuitBreakerHandler.createBreaker(designTypeModel.getAllDesignType);
const createDesignTypeBreaker = circuitBreakerHandler.createBreaker(designTypeModel.createDesignType);
const updateDesignTypeBreaker = circuitBreakerHandler.createBreaker(designTypeModel.updateDesignType);
const getDesignsByEnvironmentTypeBreaker = circuitBreakerHandler.createBreaker(designTypeModel.getDesignsByEnvironmentType);
const setDesignTypeStatusBreaker = circuitBreakerHandler.createBreaker(designTypeModel.setDesignTypeStatus);

exports.getAllDesignType = async(req, res) => {
    try {

        const designType = await getAllDesignTypeBreaker.fire();
        AnswerManager.handleSuccess(res, designType)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.createDesignType = async(req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.DesignTypeName,   
        "DesignTypes")
        
        
      let data = {
          DesignTypeName:req.body.DesignTypeName,
          MosaicType_idMosaicType:parseInt(req.body.MosaicType_idMosaicType),
      }
      if(imagePath)
      {
          data.DesignTypeIconPath=imagePath;
      }

        const createdDesignType = await createDesignTypeBreaker.fire(data);
        AnswerManager.handleSuccess(res, createdDesignType, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
exports.updateDesignType = async (req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.DesignTypeName,   
        "DesignTypes")
        
        
      let data = {
          DesignTypeName:req.body.DesignTypeName,
          MosaicType_idMosaicType:parseInt(req.body.MosaicType_idMosaicType),
      }
      if(imagePath)
      {
          data.DesignTypeIconPath=imagePath;
      }

      const id = req.params.id
      const updatedDesignType = await updateDesignTypeBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedDesignType, 'design color updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
};
  
exports.setDesignTypeStatus = async (req, res) => {

  try {

    const id = req.params.id;
    const data = req.body;
    
    const updatedDesignType = await setDesignTypeStatusBreaker.fire(id, data);
    console.log(updatedDesignType)
    AnswerManager.handleSuccess(res, updatedDesignType, 'DesignType updated successfully');

  } catch (error) {
    console.log(error)
    error.printMessage = "Couldn't update DesignType";

    AnswerManager.handleError(res, error);

  }
};
