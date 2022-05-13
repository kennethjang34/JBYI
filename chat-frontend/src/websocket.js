const baseURLForWebsocket = "ws://127.0.0.1:8000/ws/chat";
//Don't create server instance directly! Always use getServerInstance(). For singleton pattern
class WebSocketServer {
    static serverInstance = null;

    sockets = {};
    static getServerInstance() {
        if (!WebSocketServer.serverInstance) {
            WebSocketServer.serverInstance = new WebSocketServer();
        }
        return WebSocketServer.serverInstance;
    }
    setMessageHandlers(chatID, previousMessageHandelr, newMessageHandler) {
        try {
            this.sockets[chatID].previousMessagesHandler =
                previousMessageHandelr;
            this.sockets[chatID].newMessageHandler = newMessageHandler;
        } catch (error) {
            console.log(error.message);
        }
    }

    connect = (chatID = null) => {
        if (chatID === null) {
            console.log("User must specify chat room ID");
            return;
        } else {
            url = `${baseURLForWebsocket}/${chatID}`;
            // url = `ws://127.0.0.1:8000/ws/chat/${chatID}/`;
            console.log(`Connection try. URL: ${url}`);
            socketInstance = new WebSocket(url);
            socketInstance.chatID = chatID;
            if (!this.sockets[chatID]) {
                this.sockets[chatID] = {
                    socket: socketInstance,
                    previousMessagesHandler: undefined,
                    newMessageHandler: undefined,
                };
            }
            socketInstance.onOpen = () => {
                console.log(
                    `WebSocket connection successfully made. URL: ${url}`
                );
            };

            socketInstance.onClose = () => {
                if (this.sockets[socketInstance.chatID]) {
                    console.log(
                        `WebSocket connection to: ${url} closed. reconnecting...`
                    );
                    this.connect(chatID);
                } else {
                    console.log(
                        `WebSocket connection to: ${url} successfully closed`
                    );
                }
            };

            socketInstance.onError = (event) => {
                console.log(event.message);
            };

            socketInstance.onMessage = (event) => {
                this.socketMessageHandler(event.data);
            };
        }
    };

    isConnectionMade = (chatID) => {
        webSocket = this.sockets[chatID].socket;
        if (webSocket && webSocket.readyState) {
            return true;
        } else {
            return false;
        }
    };

    deleteSocket = (chatID) => {
        try {
            webSocket = this.sockets[chatID].socket;
            delete this.sockets.chatID;
            // this.sockets.splice(this.sockets.indexOf(webSocket), 1);
            webSocket.close();
        } catch (error) {
            console.log(error.message);
        }
    };

    sendMessage = (chatID, data) => {
        try {
            webSocket = this.sockets[chatID].socket;
            webSocket.send(JSON.stringify({ ...data }));
        } catch (error) {
            console.log(error.message);
        }
    };

    socketMessageHandler = (data) => {
        const parsedData = JSON.parse(data);
        const messageType = parsedData.message_type;
        switch (messageType) {
            case "previous_messages":
                messages = parsedData.messages;
                this.previousMessagesHandelr(messages);
                break;
            case "new_message":
                message = parsedData.message;
                this.newMessageHandler(message);
        }
    };
}

serverInstance = WebSocketServer.getServerInstance();
export default serverInstance;
