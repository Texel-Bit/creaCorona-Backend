const designColorsModel = require('../models/designColors.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');


const getAllDesignColorBreaker = CircuitBreakerHandler.createBreaker(designColorsModel.getAllDesignColors);
const getAllDesignColorByDeisnghTypeIdBreaker = CircuitBreakerHandler.createBreaker(designColorsModel.getAllDesignColorsByDesignTypeId);
const createDesignColorBreaker = CircuitBreakerHandler.createBreaker(designColorsModel.createDesignColors);
const updateDesignColorBreaker = CircuitBreakerHandler.createBreaker(designColorsModel.updateDesignColors);

exports.getAllDesignColors = async(req, res) => {
    try {

        const designColors = await getAllDesignColorBreaker.fire();
        AnswerManager.handleSuccess(res, designColors)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}

exports.getAllDesignColorsByDesignTypeId = async(req, res) => {
  try {
    const designTypeId = req.params.designTypeId;
      const designColors = await getAllDesignColorByDeisnghTypeIdBreaker.fire(designTypeId);
      AnswerManager.handleSuccess(res, designColors)

  } catch (error) {

      console.log(error)
      AnswerManager.handleError(res, error);

  }
}


exports.createDesignColors = async(req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.DesignColorName,   
        "DesignColors")
        
        
      let data = {
          DesignColorName:req.body.DesignColorName,
          DesignType_idDesignType:parseInt(req.body.DesignType_idDesignType),
          DesignColorType_idDesignColorType:parseInt(req.body.DesignColorType_idDesignColorType),
      }
      if(imagePath)
      {
          data.DesignColorPath=imagePath;
      }

      console.log(data)

        const createdDesignColor = await createDesignColorBreaker.fire(data);
        AnswerManager.handleSuccess(res, createdDesignColor, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateDesignColors = async (req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.DesignColorName,   
        "DesignColors")
        
        
      let data = {
          DesignColorName:req.body.DesignColorName,
          DesignType_idDesignType:parseInt(req.body.DesignType_idDesignType),
          DesignColorType_idDesignColorType:parseInt(req.body.DesignColorType_idDesignColorType),
      }
      if(imagePath)
      {
          data.DesignColorPath=imagePath;
      }
      
      const id = req.params.id
      const updatedDesignColor = await updateDesignColorBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedDesignColor, 'design color updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update design color";

      AnswerManager.handleError(res, error);

    }
  };
  
