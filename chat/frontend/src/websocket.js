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
                console.log(
                    `WebSocket connection successfully made. URL: ${url}`
                );
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

    // connect = (userToken = null) => {
    //     if (userToken === null) {
    //         console.log("User must specify chat room ID");
    //         return;
    //     } else {
    //         const url = `${baseURLForWebsocket}/${userToken}`;
    //         // url = `ws://127.0.0.1:8000/ws/chat/${chatID}/`;
    //         console.log(`Connection try. URL: ${url}`);
    //         const socketInstance = new WebSocket(url);
    //         socketInstance.chatID = userToken;
    //         if (!this.sockets[userToken]) {
    //             this.sockets[userToken] = {
    //                 socket: socketInstance,
    //                 previousMessagesHandler: undefined,
    //                 newMessageHandler: undefined,
    //             };
    //         } else {
    //             this.sockets[userToken].socket = socketInstance;
    //         }
    //     socketInstance.onopen = () => {
    //         console.log(
    //             `WebSocket connection successfully made. URL: ${url}`
    //         );
    //     };

    //     socketInstance.onclose = () => {
    //         if (this.sockets[socketInstance.chatID]) {
    //             console.log(
    //                 `WebSocket connection to: ${url} closed. reconnecting...`
    //             );
    //             this.connect(userToken);
    //         } else {
    //             console.log(
    //                 `WebSocket connection to: ${url} successfully closed`
    //             );
    //         }
    //     };

    //     socketInstance.onerror = (event) => {
    //         console.log(event.message);
    //     };

    //     socketInstance.onmessage = (event) => {
    //         this.socketMessageHandler(event.data);
    //     };
    // }
    // };

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
            // console.log(JSON.stringify({ ...data }));
            // console.log({ ...data });
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
                // const message = JSON.parse(parsedData.message);
                const message = parsedData.message;
                this.newMessageHandler(parsedData.chatID, message);
        }
    };
}
