import { connect } from "react-redux";

const baseURLForWebsocket = "ws://127.0.0.1:8000/ws/chat";
//Don't create server instance directly! Always use getServerInstance(). For singleton pattern
export class WebSocketServer {
  static serverInstance = null;
  sockets = {};

  previousMessagesHandler = null;
  newMessageHandler = null;
  socket = null;
  static getServerInstance(userToken = null) {
    if (!WebSocketServer.serverInstance) {
      WebSocketServer.serverInstance = new WebSocketServer();
    }
    if (WebSocketServer.serverInstance.socket === null) {
      if (userToken === null) {
        return null;
      }
      const url = `${baseURLForWebsocket}/${userToken}/`;
      // url = `ws://127.0.0.1:8000/ws/chat/${chatID}/`;
      console.log(`Connection try. URL: ${url}`);
      WebSocketServer.serverInstance.socket = new WebSocket(url);
      const socket = WebSocketServer.serverInstance.socket;
      socket.onopen = () => {
        console.log(`WebSocket connection successfully made. URL: ${url}`);
      };
      socket.onclose = () => {
        console.log("Connection closed");
      };

      socket.onerror = (event) => {
        console.log(event.message);
      };

      socket.onmessage = (event) => {
        WebSocketServer.serverInstance.socketMessageHandler(event.data);
      };
    }
    return WebSocketServer.serverInstance;
  }
  setMessageHandlers(chatID, previousMessagesHandler, newMessageHandler) {
    try {
      this.previousMessagesHandler = previousMessagesHandler;
      this.newMessageHandler = newMessageHandler;
    } catch (error) {
      console.log(error.message);
    }
  }

  isConnectionMade = () => {
    const webSocket = this.socket;
    if (webSocket && webSocket.readyState) {
      return true;
    } else {
      return false;
    }
  };

  deleteSocket = () => {
    try {
      const webSocket = this.socket;
      delete this.socket;
      // this.sockets.splice(this.sockets.indexOf(webSocket), 1);
      webSocket.close();
    } catch (error) {
      console.log(error.message);
    }
  };

  sendMessage = (chatID, data) => {
    try {
      const webSocket = this.socket;

      webSocket.send(JSON.stringify({ ...data, chatID: chatID }));
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  socketMessageHandler = (data) => {
    const parsedData = JSON.parse(data);
    const messageType = parsedData.message_type;
    switch (messageType) {
      case "previous_messages":
        const messages = parsedData.messages.map((jsonString) =>
          JSON.parse(jsonString)
        );

        this.previousMessagesHandler(parsedData.chatID, messages);
        break;
      case "new_message":
        console.log(parsedData.message);
        // const message = JSON.parse(parsedData.message);
        const message = parsedData.message;
        this.newMessageHandler(parsedData.chatID, message);
    }
  };
}
