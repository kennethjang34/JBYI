import React from "react";
import WebSocketServer from "../websocket";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";

//The user authentication must be global. => redux
//Chat component is react-based chat UI for each chat room. ChatID doesn't have to be global.
//ChatID is an instance-specific prop
//
class Chat extends React.Component {
    buildConnection = (chatID) => {
        WebSocketServer.connect(chatID);
        setTimeout(() => {
            if (WebSocketServer.isConectionMade(chatID)) {
                console.log(`Connectionto chat: ${chatID} successfully made`);
                WebSocketServer.setMessageHandlers(
                    chatID,
                    this.props.loadMessages,
                    this.props.addMessage
                );
                WebSocketServer.sendMessage(chatID, {
                    request: "previous_messages",
                });
            }
        }, 200);
    };
    constructor(props) {
        super(props);
        this.state.path = window.location.pathname;
        let chatID = this.state.path.split("/chat/").pop();
        buildConnection(chatID);
    }

    componentDidMount() {
        this.setState({
            //input: text input from the user for a message
            input: "",
        });
    }

    trimTimestamp(timestamp) {
        let trimmed = "";
        const date = new Date(timestamp);
        //The smallest time unit will be minute
        const timePassed = Math.round(
            (new Date().getTime() - date.getTime()) / 60000
        );

        if (timePassed < 60 && timePassed >= 1) {
            trimmed = `${timePassed} minutes ago `;
        } else if (timePassed < 24 * 60 && timePassed >= 60) {
            trimmed = `${Math.round(timePassed / 60)} hours ago`;
        } else if (timePassed < 31 * 24 * 60 && timePassed >= 24 * 60) {
            trimmed = `${Math.round(timePassed / (60 * 24))} days ago`;
        } else {
            trimmed = date.toDateString();
        }
        return trimmed;
    }

    render() {}
}

//Adding redux state as props to this component
const mapStateToProps = (state, ownProps) => {
    return {
        currentUser: state.auth.currentUser.username,
        //messages need to be retreieved dynamically for each rendering
        // unlike chatID. Redux suits
        // messages: state.message.messages,
        messages: state.chats[ownProps.chatID].messages,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addMessage: (message) =>
            dispatch(actions.messageActions.addMessage(message)),
        loadMessages: (messages) =>
            dispatch(actions.messageActions.loadMessages(messages)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
