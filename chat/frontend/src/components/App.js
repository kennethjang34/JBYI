import React from "react";
import webSocketServer from "../websocket";
import { connect } from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as messageActions from "../redux-store/actions/chatActions";
import ChatRoom from "./ChatRoom";
import ChatApp from "./ChatApp";
import SidePanel from "./SidePanel";
import { checkAuthAction } from "../redux-store/actions/authActions";
class App extends React.Component {
    constructor(props) {
        super(props);
        this.props.checkAuth();
    }

    render() {
        return <ChatApp />;
    }
}
const mapStateToProps = (state) => {
    return {
        // currentUser: state.auth.currentUser.username,
        //state.chat.chats: list of chats. Each chat contains messges belonging to that chat room
        // chats: state.chat.chats,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        checkAuth: () => dispatch(authActions.checkAuthAction),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
