import React from "react";
import webSocketServer from "./websocket";
import { connect } from "react-redux";
import * as actions from "./redux-store/actions";
class App extends React.Component {
    constructor(props) {
        super(props);
        // webSocketServer.setMessageHandlers(
        //     this.props.loadMessages,
        //     this.props.addMessage
        // );
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.currentUser.username,
        //state.chat.chats: list of chats. Each chat contains messges belonging to that chat room
        chats: state.chat.chats,
    };
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         addMessage: (message) =>
//             dispatch(actions.messageActions.addMessage(message)),
//         loadMessages: (messages) =>
//             dispatch(actions.messageActions.loadMessages(messages)),
//     };
// };
const mapDispatchToProps = (dispatch) => {};
export default connect(mapStateToProps, mapDispatchToProps)(App);
