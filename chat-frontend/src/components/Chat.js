import React from "react";
import WebSocketInstance from "../websocket";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";

//The user authentication must be global. => redux
//Chat component is react-based chat UI for each chat room. ChatID doesn't have to be global.
//ChatID is an instance-specific prop
//
class Chat extends React.Component {
    constructor(props) {}

    componentDidMount() {
        this.setState({
            //current chats retrieved.
            //Not all messages of the chat will be stored in this.state.messages,
            //Every time user requests more previous message, retrieve it from the backend
            messages: [],
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
const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.username,
    };
};
