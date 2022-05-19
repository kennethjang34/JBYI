import React from "react";
import webSocketServer from "../websocket";
import { WebSocketServer } from "../websocket";
import { connect } from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as chatActions from "../redux-store/actions/chatActions";
import ChatRoom from "./ChatRoom";
import SidePanel from "./SidePanel";
import { Outlet } from "react-router-dom";

class ChatApp extends React.Component {
    buildConnection = (userToken) => {
        const socketInstance = WebSocketServer.getServerInstance(userToken);

        setTimeout(() => {
            if (socketInstance.isConnectionMade()) {
                console.log(
                    `Connectionto chat: ${userToken} successfully made`
                );
                socketInstance.setMessageHandlers(
                    userToken,
                    this.props.loadMessages,
                    this.props.addMessage
                );
                // socketInstance.sendMessage(userToken, {
                //     request: "previous_messages",
                //     chatID: userToken,
                // });
            } else {
                console.log("waiting for socket connection");
                this.buildConnection(userToken);
            }
        }, 200);
    };

    constructor(props) {
        super(props);
        //Okay. Is the status of current user still valid?
        // props.checkAuth();

        this.buildConnection(props.token);
    }

    componentDidMount = () => {
        this.props.getChats(this.props.currentUser);
    };

    render() {
        return (
            <div>
                <SidePanel />
                {/* <div className="right"> */}
                {this.props.selected ? (
                    <ChatRoom
                        chatID={this.props.selected}
                        serverInstance={WebSocketServer.getServerInstance()}
                    />
                ) : (
                    <Outlet />
                )}
                {/* </div> */}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        //When the component is created, it is assumed that user has logged in already
        currentUser: state.auth.currentUser,
        //state.chat.chats: list of chat id's of the user
        chats: state.chat.chats,
        selected: state.chat.selected,
        token: state.auth.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        checkAuth: () => dispatch(authActions.checkAuthAction),
        logout: () => {
            // navigate.push("/login");
            dispatch(authActions.logoutAction);
        },
        getChats: (currentUser) =>
            dispatch(chatActions.getChatsAction(currentUser)),
        addMessage: (chatID, message) => {
            return dispatch(chatActions.addMessage(chatID, message));
        },
        loadMessages: (chatID, messages) => {
            return dispatch(chatActions.loadMessages(chatID, messages));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
