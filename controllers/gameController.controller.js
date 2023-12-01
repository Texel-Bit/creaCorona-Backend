
const AnswerManager = require('../middlewares/AnswerManager');
const WebSocketSingleton  = require('../middlewares/WebSocketSingleton');
const AuthManager = require('../middlewares/authMiddleware');


exports.SendMessageById = async (req, res) => {
 
 const ws=WebSocketSingleton.getWebSocketServer();
  ws.SendMessageById(req.body.wsConnectionId,"Message",req.body.message, res, async (err) => {
      try {

        if (err) {
          
          return AnswerManager.handleError(res, err);;
        }
        else
        {
          return AnswerManager.handleSuccess(res);;
        }

        // ws.send(JSON.stringify({
        //   action: 'Message',
        //   data: message
        // }));

        

      } catch (internalError) {
        return  AnswerManager.handleError(res, internalError);
      }
    });


};

