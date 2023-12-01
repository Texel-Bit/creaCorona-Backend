const groutModel = require('../models/grout.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');


const getAllGroutBreaker = CircuitBreakerHandler.createBreaker(groutModel.getAllGroutes);
const createGroutBreaker = CircuitBreakerHandler.createBreaker(groutModel.createGrout);
const updateGroutBreaker = CircuitBreakerHandler.createBreaker(groutModel.updateGrout);
const setGroutStatusBreaker = CircuitBreakerHandler.createBreaker(groutModel.setGroutStatus);

exports.getAllGroutes = async(req, res) => {
    try {

        
        const grout = await getAllGroutBreaker.fire();
        console.log(grout)
        AnswerManager.handleSuccess(res, grout)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}
const uploadFolderPath="Grouts"

exports.createGrout = async(req, res) => {
    try {
        


        const imagePath= await StorageHandler.GetImage(req.body.image,req.body.groutName,"Grouts")
        
        
        let data = {
            groutName:req.body.groutName,
        }
        if(imagePath)
        {
            data.groutColorPath=imagePath;
        }

        const createdGrout = await createGroutBreaker.fire(data);
        AnswerManager.handleSuccess(res, createdGrout);

    } catch (error) {

        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateGrout = async (req, res) => {

      try {

        console.log(req.body)
        const imagePath= await StorageHandler.GetImage(req.body.image,req.body.groutName,"Grouts")
         
        const id = req.params.id
        let data = {groutName:req.body.groutName}

        if(imagePath)
        {
            data.groutColorPath=imagePath;
        }

        
        const updatedGrout = await updateGroutBreaker.fire(id, data);
        console.log(updatedGrout)
        AnswerManager.handleSuccess(res, updatedGrout, 'Grout updated successfully');
  
      } catch (error) {
        console.log(error)
        error.printMessage = "Couldn't update Grout";
  
        AnswerManager.handleError(res, error);
  
      }
  };

  exports.setGroutStatus = async (req, res) => {

      try {

        const id = req.params.id;
        const data = req.body;
        
        const updatedGrout = await setGroutStatusBreaker.fire(id, data);
        console.log(updatedGrout)
        AnswerManager.handleSuccess(res, updatedGrout, 'Grout updated successfully');
  
      } catch (error) {
        console.log(error)
        error.printMessage = "Couldn't update Grout";
  
        AnswerManager.handleError(res, error);
  
      }
  };
  
