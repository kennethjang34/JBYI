import React from "react";
import webSocketServer from "../websocket";
import { connect } from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as messageActions from "../redux-store/actions/chatActions";
import ChatRoom from "./ChatRoom";
import SidePanel from "./SidePanel";

class ChatApp extends React.Component {
    constructor(props) {
        super(props);
        //Okay. Is the status of current user still valid?
        // props.checkAuth();
    }

    render() {
        return (
            <div>
                {/* <TopPanel currentUser={currentUser} /> */}
                {/* <SidePanel /> */}
                <div>
                    <button onClick={this.props.logout}>logout</button>
                </div>
                <ChatRoom chatID={this.props.selected} />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        checkAuth: () => dispatch(authActions.checkAuthAction),
        logout: () => {
            // navigate.push("/login");
            dispatch(authActions.logoutAction);
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
