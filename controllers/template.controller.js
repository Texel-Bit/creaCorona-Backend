const passwordMiddleware = require('../middlewares/passwordMiddleware')
const AnswerManager = require('../middlewares/AnswerManager');
const sendMail = require('../middlewares/emailMiddleware');
const templateModel = require('../models/template.model');
const Email = require('../structs/email');
const jwt = require('jsonwebtoken');
const AuthManager = require('../middlewares/authMiddleware');
const errorCodesEnum = require('../structs/Errors/ErrorCodesEnum');
const emailTemplate = require('../structs/EmailsTemplates/TemplateEmail');

exports.loginTemplate = async (req, res) => {

  try {
    const { TemplateEmail, TemplatePassword } = req.body;
    
    // Fetch the template based on email
    const template = await templateModel.getTemplateByEmail(TemplateEmail);
    

    // If no template is found, return an error
    if (!template) {
      const error={status:errorCodesEnum.NOT_FOUND,printMessage:"Template not found"};
      return AnswerManager.handleError(res, error);
    }

    const credentials={
      PasswordForValidate:TemplatePassword,storedPasswordHash:template.TemplatePassword
    }

    // Verify the password
    AuthManager.validatePassword(credentials, res, async function() {
      // This is the 'next' function's behavior
      const token = jwt.sign({ id: template.idTemplateTable }, process.env.JWT_SECRET, { expiresIn: '1h' });
      AnswerManager.handleSuccess(res, { token }, 'Login successful');
  
    });
    


  } catch (error) {
    error.printMessage="Couldn't Sign In"
    AnswerManager.handleError(res, error);
  }
};


exports.createTemplate = async (req, res) => {
  try {
    console.log(req.body);
    await passwordMiddleware.hashPassword(req, res, async () => {
      const template = await templateModel.createTemplate(req.body);
      res.status(201).json(template);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await templateModel.getAllTemplates();
    AnswerManager.handleSuccess(res, templates, 'Templates fetched successfully');
  } catch (error) {
    error.printMessage="Templates missing"
    AnswerManager.handleError(res, error);
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const id = req.params.id;
    const template = await templateModel.getTemplateById(Number(id));
    if (template) {
      AnswerManager.handleSuccess(res, template, 'Template fetched successfully');
    } else {
      const error={status:errorCodesEnum.NOT_FOUND,printMessage:"Template not found"};

      AnswerManager.handleError(res, error);
    }
  } catch (error) {
    error.printMessage="Couldn't get the Template"
    AnswerManager.handleError(res, error);
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const template = await templateModel.updateTemplate(Number(id), data);
    AnswerManager.handleSuccess(res, template, 'Template updated successfully');
  } catch (error) {
    error.printMessage="Record not found"
    AnswerManager.handleError(res, error);
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const id = req.params.id;
    await templateModel.deleteTemplate(Number(id));
    AnswerManager.handleSuccess(res, null, 'Template deleted successfully');
  } catch (error) {
    error.printMessage="Cant delete this Template"
    AnswerManager.handleError(res, error);
  }
};


exports.sendMailTemplate = (req, res, next) => {
  console.log("Testing ",req.body)
  try {
    
    const { email } = req.body;


    if(!email)
    { 
      const error={status:errorCodesEnum.BAD_REQUEST,printMessage:"Missing params"};

      return AnswerManager.handleError(res, error);
    }
    

    const userMail = new Email(email, emailTemplate.subject, emailTemplate.text, emailTemplate.html);

    
    sendMail(userMail, (error, info) => {
      if (error) {
        console.log("Error:", error);
        // Handle error
        return AnswerManager.handleError(res, error);
      }
    
      console.log("Email sent:", info.messageId);
      return AnswerManager.handleSuccess(res, { messageId: info.messageId }, 'Email sent successfully');
    });
  } catch (err) {
    error.printMessage="Couldnt send the mail"
    return AnswerManager.handleError(res, err);
  }
};



