import React from "react";
import webSocketServer from "../websocket";
import { connect } from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as messageActions from "../redux-store/actions/messageActions";
import Chat from "./Chat";
import SidePanel from "./SidePanel";
class App extends React.Component {
    constructor(props) {
        super(props);
        is_authenticated();
        // webSocketServer.setMessageHandlers(
        //     this.props.loadMessages,
        //     this.props.addMessage
        // );
    }

    render() {
        return (
            <div>
                <SidePanel />
                <Chat />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.currentUser.username,
        //state.chat.chats: list of chats. Each chat contains messges belonging to that chat room
        chats: state.chat.chats,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        is_authenticated: () => dispatch(actions.checkAuth),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
