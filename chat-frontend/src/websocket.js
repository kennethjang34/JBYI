const baseURLForWebsocket = "ws://127.0.0.1:8000/ws/chat";
//Don't create server instance directly! Always use getServerInstance(). For singleton pattern
class WebSocketServer {
    static serverInstance = null;

    sockets = {};
    static getServerInstance() {
        if (!serverInstance) {
            WebSocketServer.serverInstance = new WebSocketServer();
        }
        return WebSocketServer.serverInstance;
    }
    constructor(previousMessageHandelr, newMessageHandler) {
        this.previousMessagesHandelr = previousMessageHandelr;
        this.newMessageHandler = newMessageHandler;
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
            // if (this.sockets.indexOf(socketInstance)) {
            //     this.sockets.append(socketInstance);
            // }
            if (!this.sockets[chatID]) {
                this.sockets[chatID] = socketInstance;
            }
            socketInstance.onOpen = () => {
                console.log(
                    `WebSocket connection successfully made. URL: ${url}`
                );
            };

            socketInstance.onClose = () => {
                if (this.sockets.indexOf(socketInstance)) {
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

    deleteSocket = (chatID) => {
        try {
            webSocket = this.sockets[chatID];
            delete this.sockets.chatID;
            // this.sockets.splice(this.sockets.indexOf(webSocket), 1);
            webSocket.close();
        } catch (error) {
            console.log(error.message);
        }
    };

    sendMessage = (chatID, data) => {
        try {
            webSocket = this.sockets[chatID];
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
