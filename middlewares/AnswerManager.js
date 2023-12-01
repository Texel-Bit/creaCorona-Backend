const errorCodesEnum = require('../structs/Errors/ErrorCodesEnum');
const errorCodes = require('../structs/Errors/ErrorCodeMapping');

class AnswerManager {
  static handleSuccess(res, data, message = 'Operation successful', status = 200) {
    res.status(status).json({
      status: 'success',
      message: message,
      data: data,
    });
  }



  static handleError(res, err) {
    
    const statusCode = err.status || errorCodesEnum.INTERNAL_SERVER_ERROR;
    const errorMessage = errorCodes[statusCode] || 'Unknown Error';
    if(process.env.NODE_ENV==="development")
    {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: err.printMessage,
            developmentMessage: err.message || errorMessage,
            
          });
    }
    else
    {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: err.printMessage,
          });
    }

  }

  static handleFieldValidationError(res, err) {
    
    const statusCode = errorCodesEnum.FIELDS_MISSING;
    const errorMessage = errorCodes[statusCode] || 'Unknown Error';
    if(process.env.NODE_ENV==="development")
    {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: errorMessage,
            developmentMessage: err.ValidationError || errorMessage,
            
          });
    }
    else
    {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: errorMessage,
          });
    }

  }
}

module.exports = AnswerManager;
