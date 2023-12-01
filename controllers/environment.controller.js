const environmentModel = require('../models/environment.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');


const getAllEnvironmentBreaker = CircuitBreakerHandler.createBreaker(environmentModel.getAllEnvironments);
const createEnvironmentBreaker = CircuitBreakerHandler.createBreaker(environmentModel.createEnviorment);
const updateEnvironmentBreaker = CircuitBreakerHandler.createBreaker(environmentModel.updateEnvironment);
const getAllEnvironmentByEnvironmentTypeBreaker = CircuitBreakerHandler.createBreaker(environmentModel.getAllEnvironmentByEnvironmentType);
const setEnvironmentStatusBreaker = CircuitBreakerHandler.createBreaker(environmentModel.setEnvironmentStatus);

exports.getAllEnvironment = async(req, res) => {
    try {

        const enviormenTypes = await getAllEnvironmentBreaker.fire();
        AnswerManager.handleSuccess(res, enviormenTypes)

    } catch (error) {

        AnswerManager.handleError(res, error);

    }
}

exports.getAllEnvironmentByEnvironmentType = async(req, res) => {
  try {

    const id = req.params.id;
    const environment = await getAllEnvironmentByEnvironmentTypeBreaker.fire(id)
    console.log(environment)

    if (environment) {

      AnswerManager.handleSuccess(res, environment)
    } else {

      AnswerManager.handleError(res, null, "Couldn't find environment by this id")
    }

  } catch (error) {

    console.log(error)
    AnswerManager.handleError(res, error)
  }
}

  exports.createEnvironment = async(req, res) => {
      try {

        const imagePathMask= await StorageHandler.GetImage(req.body.imageMask,
          req.body.EnvironmentName+'mask',   
          "Environments")

          const imagePathProfile= await StorageHandler.GetImage(req.body.imageProfile,
          req.body.EnvironmentName,   
          "Environments")
          
          
        let data = {
            EnvironmentName:req.body.EnvironmentName,
            EnvironmentAngle:req.body.EnvironmentAngle,
            EnvironmentType_idEnvironmentType:parseInt(req.body.EnvironmentType_idEnvironmentType),
        }
        if(imagePathMask)
        {
            data.EnvironmentMaksImage=imagePathMask;
        }
        if (imagePathProfile)
        {
          data.EnvironmentProfileImage=imagePathProfile;

        }
        
          const createdEnvirnmentType = await createEnvironmentBreaker.fire(data);
          AnswerManager.handleSuccess(res, createdEnvirnmentType, req.body);

      } catch (error) {

          AnswerManager.handleError(res, error);
      }
  }
  
  exports.updateEnvironment = async (req, res) => {
    try {

      const imagePathMask= await StorageHandler.GetImage(req.body.imageMask,
        req.body.EnvironmentName+'mask',   
        "Environments")

        const imagePathProfile= await StorageHandler.GetImage(req.body.imageProfile,
        req.body.EnvironmentName,   
        "Environments")
        
        
      let data = 
      {
          EnvironmentName:req.body.EnvironmentName,
          EnvironmentAngle:req.body.EnvironmentAngle
       }

      if(imagePathMask)
      {
          data.EnvironmentMaksImage=imagePathMask;
      }

      if (imagePathProfile)
      {
        data.EnvironmentProfileImage=imagePathProfile;
      }

      console.log(data)

      const id = req.params.id

      const updatedEnvironment = await updateEnvironmentBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedEnvironment, 'environment type updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update environment type";

      AnswerManager.handleError(res, error);

    }
  };

  exports.setEnvironmentStatus = async (req, res) => {

    try {

      const id = req.params.id;
      const data = req.body;
      
      const updatedEnvironment = await setEnvironmentStatusBreaker.fire(id, data);
      console.log(updatedEnvironment)
      AnswerManager.handleSuccess(res, updatedEnvironment, 'Environment updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update Environment";

      AnswerManager.handleError(res, error);

    }
};

  