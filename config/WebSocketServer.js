const WebSocket = require('ws');

const gameController = require('../controllers/gameController.controller');
const { generateRandomWebSocketId } = require('../middlewares/passwordMiddleware');
const ErrorCodesEnum = require('../structs/Errors/ErrorCodesEnum');

class WebSocketServer {

  clients = {};
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
      // Create an object to store WebSocket clients

    this.wss.on('connection', async (ws, req) => {
      const uniqueId = await generateRandomWebSocketId(); // Assume this function generates a unique id
      ws.id = uniqueId;  // Attach the ID to the WebSocket instance
      this.clients[uniqueId] = ws;  // Add the WebSocket instance to the clients object

      this.SendWebSocketMessageBySocketById(uniqueId,"Message", uniqueId);

      // Extract userId somehow, either from the URL or from an initial message
      //const userId = validateJWT(req);
      //await gameController.handleNewConnection(ws, userId);

      ws.on('message', (message) => {
        // existing logic
      });

      ws.on('close', () => {
        // Remove the WebSocket instance from the clients object when it is closed
        delete this.clients[uniqueId];
      });
    });
  }

  // Function to find a WebSocket by its ID
  findWebSocketById(id) {
   
    return this.clients[id];
  }

  SendWebSocketMessageBySocketById(id,action,message) {
    console.log("Sending socket message ")
    Object.keys(this.clients).forEach((key) => {
        if(id===key)
        {
            this.clients[key].send(JSON.stringify({
                action: action,
                data: message
              }));
        }
    });
  
    return this.clients[id];
  }

  SendMessageById(socketId,action,message, result, next) {
    
    const error = { status: ErrorCodesEnum.NETWORK_AUTHENTICATION_REQUIRED, printMessage: "Socket is missing" };
    if (!socketId) {
      return next(error, null);
    }
    
    try
    {
        if (this.findWebSocketById(socketId)) {

            this.SendWebSocketMessageBySocketById(socketId,action,message)
            return next(null);
          } else {
            return next(error, null);
          }
    }
    catch(err)
    {
        return next(error, null);
    }
   
  }


  
}

module.exports = WebSocketServer;
