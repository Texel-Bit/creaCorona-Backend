const designTypeFormatSizeModel = require('../models/designTypeFormatSize.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');


const getAllDesignTypeFormatSizeBreaker = CircuitBreakerHandler.createBreaker(designTypeFormatSizeModel.getAllDesignTypeFormatSize);
const getAllDesignTypeByDesignTypeIdBreaker = CircuitBreakerHandler.createBreaker(designTypeFormatSizeModel.getAllDesignTypeByDesignTypeId);
const createDesignTypeFormatSizeBreaker = CircuitBreakerHandler.createBreaker(designTypeFormatSizeModel.createDesignTypeFormatSize);
const updateDesignTypeFormatSizeBreaker = CircuitBreakerHandler.createBreaker(designTypeFormatSizeModel.updateDesignTypeFormatSize);
const setDesignTypeFormatSizeStatusBreaker = CircuitBreakerHandler.createBreaker(designTypeFormatSizeModel.setDesignTypeFormatSizeStatus);
const getDesignTypeFormatSizByEnvironmentTypeIdBreaker = CircuitBreakerHandler.createBreaker(designTypeFormatSizeModel.getDesignTypeFormatSizByEnvironmentTypeId);

exports.getAllDesignTypeFormatSize = async(req, res) => {
    try {

        const designTypeFormatSize = await getAllDesignTypeFormatSizeBreaker.fire();
        AnswerManager.handleSuccess(res, designTypeFormatSize)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.getAllDesignTypeByDesignTypeId = async(req, res) => {
  try {
    const { designTypeId } = req.params;
      const designTypeFormatSize = await getAllDesignTypeByDesignTypeIdBreaker.fire(designTypeId);
      AnswerManager.handleSuccess(res, designTypeFormatSize)

  } catch (error) {

      console.log(error)
      AnswerManager.handleError(res, error);

  }
}


exports.createDesignTypeFormatSize = async(req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.DesignTypeFormatSizeName,   
        "DesignTypeFormatSizes")
        
        
      let data = {
          DesignTypeFormatSizeName:req.body.DesignTypeFormatSizeName,
          DesignType_idDesignType:parseInt(req.body.DesignType_idDesignType),
          DesignTypeFormatSizeHeight:req.body.DesignTypeFormatSizeHeight,
          DesignTypeFormatSizeWidht:parseFloat(req.body.DesignTypeFormatSizeWidht),
          DesignTypeFormatSizeMosaicScale:parseFloat(req.body.DesignTypeFormatSizeMosaicScale),
      }

     
      if(imagePath)
      {
          data.DesignTypeFormatSizeDefaultImagePath=imagePath;
      }



        const createdDesignTypeFormatSize = await createDesignTypeFormatSizeBreaker.fire(data);
        AnswerManager.handleSuccess(res, createdDesignTypeFormatSize, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateDesignTypeFormatSize = async (req, res) => {
    try {

      const id = req.params.id

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.DesignTypeFormatSizeName,   
        "DesignTypeFormatSizes")
        
      let data = {
        DesignTypeFormatSizeName:req.body.DesignTypeFormatSizeName,
        DesignTypeFormatSizeHeight:req.body.DesignTypeFormatSizeHeight,
        DesignTypeFormatSizeWidht:parseFloat(req.body.DesignTypeFormatSizeWidht),
        DesignTypeFormatSizeMosaicScale:parseFloat(req.body.DesignTypeFormatSizeMosaicScale),
    }

    if(imagePath)
    {
        data.DesignTypeFormatSizeDefaultImagePath=imagePath;
    }

      const updatedDesignTypeFormatSize = await updateDesignTypeFormatSizeBreaker.fire(id, data);
  

      console.log(data);
      AnswerManager.handleSuccess(res, updatedDesignTypeFormatSize, 'design color updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
  };
  
  exports.setDesignTypeFormatSizeStatus = async (req, res) => {

    try {

      const id = req.params.id;
      const data = req.body;
      
      const updatedDesignTypeFormatSize = await setDesignTypeFormatSizeStatusBreaker.fire(id, data);
      console.log(updatedDesignTypeFormatSize)
      AnswerManager.handleSuccess(res, updatedDesignTypeFormatSize, 'DesignTypeFormatSize updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update DesignTypeFormatSize";

      AnswerManager.handleError(res, error);

    }
};

exports.getDesignTypeFormatSizeByEnvironmentTypeId = async (req, res) => {
  try {

    const environmentTypeId = req.params.id

    const designTypeFormatSize = await getDesignTypeFormatSizByEnvironmentTypeIdBreaker.fire(environmentTypeId)

    AnswerManager.handleSuccess(res, designTypeFormatSize)

  } catch (error) {

    AnswerManager.handleError(res, error)

  } 
}