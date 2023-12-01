const environmentTypeModel = require('../models/environmentType.model');
const designTypeFormatSizeModel = require('../models/designTypeFormatSize.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');


const getAllEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.getAllEnvironmentTypes);
const createEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.createEnviormentType);
const updateEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.updateEnvironmentType);
const createDesignTypeEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.createDesignTypeEnvironmentType);
const deleteDesignTypeEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.deleteDesignTypeEnvironmentType);
const getAllDesignTypeFormatSizeForEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.getAllDesignTypeFormatSizeForEnvironmentType);
const createDesignTypeFormatSizeForEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.createDesignTypeFormatSizeForEnvironmentType);
const deleteDesignTypeFormatSizeForEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.deleteDesignTypeFormatSizeForEnvironmentType);
const getDesignColorTypesByEnvironmentIdAndDesignTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.getDesignColorTypesByEnvironmentIdAndDesignType)
const getAllDesignColorTypeHasDesignTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.getAllDesignColorTypeHasDesignType);
const addDescignColorTypeToEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.addDesignColorTypeToEnvironmentType);
const deleteDesignColorsTypeOfEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.deleteDesignColorsTypeOfEnvironmentType);

const deleteFormatSizeOfEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.deleteFormatSizeOfEnvironmentType);

const getAllDesignTypeEnvironmentType = CircuitBreakerHandler.createBreaker(environmentTypeModel.getAllDesignTypeEnvironmentType);
const getAllDesignTypeByEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.getAllDesignTypeByEnvironmentType);
const setEnvironmentTypeStatusBreaker = CircuitBreakerHandler.createBreaker(environmentTypeModel.setEnvironmentTypeStatus);


exports.getAllEnvironmentType = async(req, res) => {
    try {

        const enviormenTypes = await getAllEnvironmentTypeBreaker.fire();
        AnswerManager.handleSuccess(res, enviormenTypes)

    } catch (error) {

        AnswerManager.handleError(res, error);

    }
};

exports.getAllDesignTypeByEnvironmentType = async(req, res) => {
  try {

    const id = req.params.id;
    const designTypeEnvironmentType = await getAllDesignTypeByEnvironmentTypeBreaker.fire(id);
    AnswerManager.handleSuccess(res, designTypeEnvironmentType)

  } catch (error) {

    AnswerManager.handleError(res, error);

  }
}

exports.getAllDesignTypeEnvironmentType = async(req, res) => {
  try {

    const designTypeEnvironmentType = await getAllDesignTypeEnvironmentType.fire();
    AnswerManager.handleSuccess(res, designTypeEnvironmentType)

  } catch (error) {

    AnswerManager.handleError(res, error);

  }
}

exports.createEnvironmentType = async(req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.EnvironmentTypeName,   
        "EnvironmentTypes")
        
        
      let data = {
          EnvironmentTypeName:req.body.EnvironmentTypeName,
          WorkWithStructure:req.body.WorkWithStructure,
          EnvironmentTypeIcon:req.body.EnvironmentTypeIcon,
      }
      if(imagePath)
      {
          data.EnvironmentTypeImage=imagePath;
      }

        const createdEnvirnmentType = await createEnvironmentTypeBreaker.fire(data);
        AnswerManager.handleSuccess(res, createdEnvirnmentType, req.body);
        console.log(createdEnvirnmentType)

    } catch (error) {
      console.log(error)
        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateEnvironmentType = async (req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.EnvironmentTypeName,   
        "EnvironmentTypes")
        
        
      let data = {
          EnvironmentTypeName:req.body.EnvironmentTypeName,
          WorkWithStructure:req.body.WorkWithStructure,
          EnvironmentTypeIcon:req.body.EnvironmentTypeIcon,
      }
      if(imagePath)
      {
          data.EnvironmentTypeImage=imagePath;
      }
      
      const id = req.params.id
      const updatedEnvironmentType = await updateEnvironmentTypeBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedEnvironmentType, 'environment type updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update environment type";

      AnswerManager.handleError(res, error);

    }
  };

exports.createDesignTypeEnvironmentType = async(req, res) => {
    try {

        const createdEnvirnmentType = await createDesignTypeEnvironmentTypeBreaker.fire(req.body);
        AnswerManager.handleSuccess(res, createdEnvirnmentType, req.body);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}

exports.deleteDesignTypeEnvironmentType = async (req, res) => {
  try {

    const idEnvironmentType = req.body.EnvironmentType_idEnvironmentType;
    const idDesignType = req.body.DesignType_idDesignType

    await deleteDesignTypeEnvironmentTypeBreaker.fire(parseInt(idEnvironmentType), parseInt(idDesignType));

    console.log(idEnvironmentType, idDesignType)

    AnswerManager.handleSuccess(res, null, 'DesignColorInBundle deleted successfully');

  } catch (error) {

    error.printMessage = "Couldn't delete DesignColorInBundle";
    AnswerManager.handleError(res, error);

  }
};

exports.getAllDesignTypeFormatSizeForEnvironmentType = async(req, res) => {
  try {

      const designTypeFormatSizeForEnvironmentType = await getAllDesignTypeFormatSizeForEnvironmentTypeBreaker.fire(req.body);
      AnswerManager.handleSuccess(res, designTypeFormatSizeForEnvironmentType)

  } catch (error) {

      AnswerManager.handleError(res, error);

  }
};

exports.createDesignTypeFormatSizeForEnvironmentType = async(req, res) => {
  try {

    const formatsSizeToDelete=await designTypeFormatSizeModel.getAllDesignTypeByDesignTypeId(req.body.DesignType_idDesignType);
    
    let formatsIds=[];
    let insertData=[];

    console.log(req.body);
    
    formatsSizeToDelete.forEach(element => {
      formatsIds.push(element.idDesignTypeFormatSize)
     });

    

    const data=
    {
      EnvironmentType_idEnvironmentType:parseInt(req.body.EnvironmentType_idEnvironmentType),
      DesignTypeFormatSize_idDesignTypeFormatSize:formatsIds
    }

    await deleteFormatSizeOfEnvironmentTypeBreaker.fire(data)

    

    req.body.formatsSize.forEach(element => {
     insertData.push({...data,DesignTypeFormatSize_idDesignTypeFormatSize:element})
    });

    
      const createdDesignTypeFormatSizeForEnvironmentType = await createDesignTypeFormatSizeForEnvironmentTypeBreaker.fire(insertData);

      AnswerManager.handleSuccess(res, createdDesignTypeFormatSizeForEnvironmentType);

  } catch (error) {

    console.log(error)
      AnswerManager.handleError(res, error);
  }
}

exports.deleteDesignTypeFormatSizeForEnvironmentType = async (req, res) => {
  try {

    const idFormatSize = req.body.DesignTypeFormatSize_idDesignTypeFormatSize
    const idEnvironmentType = req.body.EnvironmentType_idEnvironmentType

    await deleteDesignTypeFormatSizeForEnvironmentTypeBreaker.fire(req.body)

    AnswerManager.handleSuccess(res, null, 'Design Format Size deleted')
    
  } catch (error) {

    AnswerManager.handleError(error)
  }
 }

exports.getDesignColorTypesByEnvironmentIdAndDesignType = async (req, res) => {
  try {
    
    const idEnvironmentType = req.body.EnvironmentType_idEnvironmentType;
    const idDesignType = req.body.DesignType_idDesignType;

    const designColorType = await getDesignColorTypesByEnvironmentIdAndDesignTypeBreaker.fire(parseInt(idEnvironmentType), parseInt(idDesignType));

    console.log(designColorType);

    if (designColorType) {
      
      AnswerManager.handleSuccess(res, designColorType);

    } else {

      const error = { status: ErrorCodesEnum.NOT_FOUND, printMessage: "design color bundle configuration not found" };
     
      AnswerManager.handleError(res, error);

    }


  } catch (error) {

    console.log(error);
    error.printMessage = "Couldn't get the design color bundle by filters";
    AnswerManager.handleError(res, error);

  }
};

exports.getAllDesignColorTypeHasDesignType = async(req, res) => {
  try {

      const enviormenTypes = await getAllDesignColorTypeHasDesignTypeBreaker.fire();
      AnswerManager.handleSuccess(res, enviormenTypes)

  } catch (error) {

      AnswerManager.handleError(res, error);

  }
}

exports.addDesignColorTypeToEnvironmentType = async(req, res) => {
  try {

    const data=
    {
      EnvironmentType_idEnvironmentType:parseInt(req.body.EnvironmentType_idEnvironmentType),
      DesignType_idDesignType:parseInt(req.body.DesignType_idDesignType)
    }

     await deleteDesignColorsTypeOfEnvironmentTypeBreaker.fire(data)
    
     let insertData=[];

     req.body.DesignColorType_idDesignColorType.forEach(element => {
      insertData.push({...data,DesignColorType_idDesignColorType:element})
     });
     
     console.log(insertData);
     

     const designColorTypeToEnvironmentType = await addDescignColorTypeToEnvironmentTypeBreaker.fire(insertData)
    AnswerManager.handleSuccess(res, designColorTypeToEnvironmentType)
  
  } catch (error) {

    AnswerManager.handleError(res, error);
  }

}

exports.setEnvironmentTypeStatus = async (req, res) => {

  try {

    const id = req.params.id;
    const data = req.body;
    
    const updatedEnvironmentType = await setEnvironmentTypeStatusBreaker.fire(id, data);
    
    AnswerManager.handleSuccess(res, updatedEnvironmentType, 'EnvironmentType updated successfully');

  } catch (error) {
    console.log(error)
    error.printMessage = "Couldn't update EnvironmentType";

    AnswerManager.handleError(res, error);

  }
};
