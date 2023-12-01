const companyModel = require('../models/company.model');
const CircuitBreakerHandler = require('../middlewares/CircuitBreakerHandler');
const AnswerManager = require('../middlewares/AnswerManager');
const StorageHandler = require('../middlewares/StorageHandler');

const getAllCompanysBreaker = CircuitBreakerHandler.createBreaker(companyModel.getAllCompanys);
const getAllCompanysRolesBreaker = CircuitBreakerHandler.createBreaker(companyModel.getAllCompanyRole);
const createCompanyBreaker = CircuitBreakerHandler.createBreaker(companyModel.createCompany);
const updateCompanyBreaker = CircuitBreakerHandler.createBreaker(companyModel.updateCompany);

exports.getAllCompanys = async(req, res) => {
    try {

        const company = await getAllCompanysBreaker.fire();
        AnswerManager.handleSuccess(res, company)

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);

    }
}


exports.getAllCompanyRoles = async(req, res) => {
  try {

      const company = await getAllCompanysRolesBreaker.fire();
      AnswerManager.handleSuccess(res, company)

  } catch (error) {

      console.log(error)
      AnswerManager.handleError(res, error);

  }
}


exports.createCompany = async(req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.CompanyName,   
        "Companies")
        
        
      let data = {
          CompanyName:req.body.CompanyName,
          CompanyAddress:req.body.CompanyAddress,
          CompanyEmail:req.body.CompanyEmail,
          CompanyContactName:req.body.CompanyContactName,
          CompanyCode:req.body.CompanyCode,
          CompanyNIT:req.body.CompanyNIT,
          CompanyPhone:req.body.CompanyPhone,
          companyStatus_idcompanyStatus:parseInt(req.body.companyStatus_idcompanyStatus),
          CompanyRole_idCompanyRole:parseInt(req.body.CompanyRole_idCompanyRole),
          companyType_idcompanyType:parseInt(req.body.companyType_idcompanyType),
      }
      if(imagePath)
      {
          data.CompanyImagePath=imagePath;
      }
        console.log(req.body)
        const createdCompany = await createCompanyBreaker.fire(data);
        AnswerManager.handleSuccess(res, createdCompany, req.body);

    } catch (error) {

        console.log(error)
        AnswerManager.handleError(res, error);
    }
}
  
  exports.updateCompany = async (req, res) => {
    try {

      const imagePath= await StorageHandler.GetImage(req.body.image,
        req.body.CompanyName,   
        "Companies")
        
        
      let data = {
          CompanyName:req.body.CompanyName,
          CompanyAddress:req.body.CompanyAddress,
          CompanyEmail:req.body.CompanyEmail,
          CompanyContactName:req.body.CompanyContactName,
          CompanyCode:req.body.CompanyCode,
          CompanyNIT:req.body.CompanyNIT,
          CompanyPhone:req.body.CompanyPhone,
          companyStatus_idcompanyStatus:parseInt(req.body.companyStatus_idcompanyStatus),
          CompanyRole_idCompanyRole:parseInt(req.body.CompanyRole_idCompanyRole),
          companyType_idcompanyType:parseInt(req.body.companyType_idcompanyType),
      }
      if(imagePath)
      {
          data.CompanyImagePath=imagePath;
      }

      console.log(data)
      const id = req.params.id
      const updatedCompany = await updateCompanyBreaker.fire(id, data);

      AnswerManager.handleSuccess(res, updatedCompany, 'Company updated successfully');

    } catch (error) {
      console.log(error)
      error.printMessage = "Couldn't update Company";

      AnswerManager.handleError(res, error);

    }
  };
  
