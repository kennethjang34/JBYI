import React from "react";
import webSocketServer from "../websocket";
import { connect } from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as chatActions from "../redux-store/actions/chatActions";
import ChatRoom from "./ChatRoom";
import SidePanel from "./SidePanel";
import { Outlet } from "react-router-dom";

class ChatApp extends React.Component {
    constructor(props) {
        super(props);
        //Okay. Is the status of current user still valid?
        // props.checkAuth();
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
                    <ChatRoom chatID={this.props.selected} />
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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
