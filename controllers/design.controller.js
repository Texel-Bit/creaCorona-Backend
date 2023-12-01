const designModel = require('../models/design.model');
const circuitBreakerHandler = require('../middlewares/circuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');
const environmentTypeModel = require('../models/environmentType.model')


const getAllDesignBreaker = circuitBreakerHandler.createBreaker(designModel.getAllDesign);
const createDesignBreaker = circuitBreakerHandler.createBreaker(designModel.createDesign);
const updateDesignBreaker = circuitBreakerHandler.createBreaker(designModel.updateDesign);
const getAllDesignsByDesignTypeIdBreaker = circuitBreakerHandler.createBreaker(designModel.getAllDesignsByDesignTypeId);
const setDesignStatusBreaker = circuitBreakerHandler.createBreaker(designModel.setDesignStatus);
const getDesignsByEnvironmentTypeBreaker = circuitBreakerHandler.createBreaker(designModel.getDesignsByEnvironmentType);

exports.getAllDesign = async(req, res) => {
    try {

        const design = await getAllDesignBreaker.fire();
        AnswerManager.handleSuccess(res, design)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.getDesignsByEnvironmentType = async (req, res) => {
  try {

    const idDesignType = req.body.DesignType_idDesignType;
    const idEnvironmentType = req.body.EnvironmentType_idEnvironmentType;

    console.log(req.body)
    
    const designTypeTest = await getDesignsByEnvironmentTypeBreaker.fire(parseInt(idEnvironmentType), parseInt(idDesignType))  


    AnswerManager.handleSuccess(res, designTypeTest);
    
  } catch (error) {

    console.log(error)
    AnswerManager.handleError(res, error);

  }

}

exports.getAllDesignsByDesignTypeId = async(req, res) => {
  try {
    const { designTypeId } = req.params;
      const design = await getAllDesignsByDesignTypeIdBreaker.fire(designTypeId);
      AnswerManager.handleSuccess(res, design)

  } catch (error) {

      console.log(error)
      AnswerManager.handleError(res, error);

  }
}

exports.createDesign = async(req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.DesignName,   
        "Designs")
        
        
      let data = {
          DesignName: req.body.DesignName,
          DesignSellPrice: parseFloat(req.body.DesignSellPrice),
          DesignType_idDesignType: parseInt(req.body.DesignType_idDesignType),
          DesignColorType_idDesignColorType: parseInt(req.body.DesignColorType_idDesignColorType),
      }
      if(imagePath)
      {
          data.DesignImagePath=imagePath;
      }

      console.log(data)
        const createdDesign = await createDesignBreaker.fire(data);
        AnswerManager.handleSuccess(res, createdDesign, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateDesign = async (req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.DesignName,   
        "Designs")
        
        
      let data = {
          DesignName: req.body.DesignName,
          DesignSellPrice: parseFloat(req.body.DesignSellPrice),
          DesignType_idDesignType: parseInt(req.body.DesignType_idDesignType),
          DesignColorType_idDesignColorType: parseInt(req.body.DesignColorType_idDesignColorType),
      }
      if(imagePath)
      {
          data.DesignImagePath=imagePath;
      }

      const id = req.params.id
      const updatedDesign = await updateDesignBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedDesign, 'design color updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
  };

  exports.setDesignStatus = async (req, res) => {

    try {

      const id = req.params.id;
      const data = req.body;
      
      const updatedDesign = await setDesignStatusBreaker.fire(id, data);
      console.log(updatedDesign)
      AnswerManager.handleSuccess(res, updatedDesign, 'Design updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update Design";

      AnswerManager.handleError(res, error);

    }
};
  
