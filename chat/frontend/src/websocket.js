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
    setMessageHandlers(chatID, previousMessageHandler, newMessageHandler) {
        try {
            this.sockets[chatID].previousMessagesHandler =
                previousMessageHandler;
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
            const url = `${baseURLForWebsocket}/${chatID}`;
            // url = `ws://127.0.0.1:8000/ws/chat/${chatID}/`;
            console.log(`Connection try. URL: ${url}`);
            const socketInstance = new WebSocket(url);
            socketInstance.chatID = chatID;
            if (!this.sockets[chatID]) {
                this.sockets[chatID] = {
                    socket: socketInstance,
                    previousMessagesHandler: undefined,
                    newMessageHandler: undefined,
                };
            } else {
                this.sockets[chatID].socket = socketInstance;
            }
            socketInstance.onopen = () => {
                console.log(
                    `WebSocket connection successfully made. URL: ${url}`
                );
            };

            socketInstance.onclose = () => {
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

            socketInstance.onerror = (event) => {
                console.log(event.message);
            };

            socketInstance.onmessage = (event) => {
                // console.log("abcd");
                // console.log(event.data);
                this.socketMessageHandler(event.data);
            };
        }
    };

    isConnectionMade = (chatID) => {
        const webSocket = this.sockets[chatID].socket;
        if (webSocket && webSocket.readyState) {
            return true;
        } else {
            return false;
        }
    };

    deleteSocket = (chatID) => {
        try {
            const webSocket = this.sockets[chatID].socket;
            delete this.sockets.chatID;
            // this.sockets.splice(this.sockets.indexOf(webSocket), 1);
            webSocket.close();
        } catch (error) {
            console.log(error.message);
        }
    };

    sendMessage = (chatID, data) => {
        try {
            const webSocket = this.sockets[chatID].socket;
            // console.log(JSON.stringify({ ...data }));
            // console.log({ ...data });
            webSocket.send(JSON.stringify({ ...data }));
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
                this.sockets[parsedData.chatID].previousMessagesHandler(
                    parsedData.chatID,
                    messages
                );
                break;
            case "new_message":
                // const message = JSON.parse(parsedData.message);
                const message = parsedData.message;
                this.sockets[parsedData.chatID].newMessageHandler(
                    parsedData.chatID,
                    message
                );
        }
    };
}

const serverInstance = WebSocketServer.getServerInstance();
export default serverInstance;
