import React from "react";
import webSocketServer from "../websocket";
import { connect } from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as messageActions from "../redux-store/actions/messageActions";
import ChatRoom from "./ChatRoom";
import SidePanel from "./SidePanel";
class ChatApp extends React.Component {
    constructor(props) {
        super(props);
        checkAuth();
        // webSocketServer.setMessageHandlers(
        //     this.props.loadMessages,
        //     this.props.addMessage
        // );
    }

    render() {
        return (
            <div>
                <SidePanel />
                <ChatRoom />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        //When the component is created, it is assumed that user has logged in already
        currentUser: state.auth.currentUser.username,
        //state.chat.chats: list of chats. Each chat contains messges belonging to that chat room
        chats: state.chat.chats,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // checkAuth: () => dispatch(authActions.checkAuthAction),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
