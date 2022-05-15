import React from "react";
import socketServerInstance from "../websocket";
import { connect } from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as messageActions from "../redux-store/actions/chatActions";
import * as chatActions from "../redux-store/actions/chatActions";
import serverInstance from "../websocket";
//The user authentication must be global. => redux
//Chat component is react-based chat UI for each chat room. ChatID doesn't have to be global.
//ChatID is an instance-specific prop
//
class ChatRoom extends React.Component {
    buildConnection = (chatID) => {
        if (
            socketServerInstance.sockets[chatID] &&
            socketServerInstance.sockets[chatID].socket
        ) {
            console.log(`Connectionto chat: ${chatID} already exists`);
            socketServerInstance.setMessageHandlers(
                chatID,
                this.props.loadMessages,
                this.props.addMessage
            );
            socketServerInstance.sendMessage(chatID, {
                request: "previous_messages",
                chatID: chatID,
            });
        }
        socketServerInstance.connect(chatID);
        setTimeout(() => {
            if (socketServerInstance.isConnectionMade(chatID)) {
                console.log(`Connectionto chat: ${chatID} successfully made`);
                socketServerInstance.setMessageHandlers(
                    chatID,
                    this.props.loadMessages,
                    this.props.addMessage
                );
                socketServerInstance.sendMessage(chatID, {
                    request: "previous_messages",
                    chatID: chatID,
                });
            } else {
                console.log("waiting for socket connection");
                this.buildConnection(chatID);
            }
        }, 200);
    };
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            input: "",
        };
        this.state.path = window.location.pathname;
        let chatID = this.state.path.split("/chat/").pop();
        this.buildConnection(chatID);
    }

    // componentDidMount() {
    //     this.setState({
    //         //input: text input from the user for a message
    //         input: "",
    //     });
    // }

    sendMessage = (event) => {
        event.preventDefault();
        const message = {
            author: this.props.currentUser,
            //This needs to be changed
            content: this.state.input,
            //Planning to change it to a list
            chatID: window.location.pathname.split("/chat/").pop(),
            // timestamp: new Date().getDate() / 1000,
        };
        serverInstance.sendMessage(message.chatID, {
            request: "new_message",
            message: message,
        });
        this.setState({
            input: "",
        });
    };

    trimTimestamp(timestamp) {
        let trimmed = "";
        const date = new Date(timestamp);
        //The smallest time unit will be minute
        const timePassed = Math.round(
            (new Date().getTime() - date.getTime()) / 60000
        );
        if (timePassed < 1) {
            trimmed = "Just sent";
        } else if (timePassed < 60 && timePassed >= 1) {
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

    TopPanel(props) {
        return (
            <div className="action-header clearfix">
                <div className="visible-xs" id="ms-menu-trigger">
                    <i className="fa fa-bars"></i>
                </div>

                <div className="pull-left hidden-xs">
                    <img
                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                        alt=""
                        className="img-avatar m-r-10"
                    />
                    <div className="lv-avatar pull-left"></div>
                    <span>David Parbell</span>
                </div>

                <ul className="ah-actions actions">
                    <li>
                        <a href="">
                            <i className="fa fa-trash"></i>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i className="fa fa-check"></i>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i className="fa fa-clock-o"></i>
                        </a>
                    </li>
                    <li className="dropdown">
                        <a href="" data-toggle="dropdown" aria-expanded="true">
                            <i className="fa fa-sort"></i>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-right">
                            <li>
                                <a href="">Latest</a>
                            </li>
                            <li>
                                <a href="">Oldest</a>
                            </li>
                        </ul>
                    </li>
                    <li className="dropdown">
                        <a href="" data-toggle="dropdown" aria-expanded="true">
                            <i className="fa fa-bars"></i>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-right">
                            <li>
                                <a href="">Refresh</a>
                            </li>
                            <li>
                                <a href="">Message Settings</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <script>
                    {document.addEventListener("DOMContentLoaded", () => {
                        if (document.getElementById("ms-menu-trigger")[0]) {
                            $("body").on(
                                "click",
                                "#ms-menu-trigger",
                                function () {
                                    document
                                        .getElementByClassName("ms-menu")
                                        .classList.toggle("toggled");
                                }
                            );
                        }
                    })}
                    ;
                </script>
            </div>
        );
    }

    changeCurrentInput = (event) => {
        this.state.input = event.target.value;
    };

    renderMessages(messages) {
        const messages_rendered = messages.map((message) => {
            return (
                <div className="message-feed ">
                    <div
                        className={
                            message.author === this.props.currentUser
                                ? "sent"
                                : `received from: ${message.author}`
                        }
                    >
                        <img
                            src="https://bootdey.com/img/Content/avatar/avatar2.png"
                            alt=""
                            className="img-avatar"
                        />
                    </div>
                    <p className="mf-content">
                        {message.content}
                        <br />
                        <small className="mf-date">
                            {this.trimTimestamp(message.timestamp)}
                        </small>
                    </p>
                </div>
            );
        });
        return messages_rendered;
    }

    render() {
        let messages = [];
        if (this.props.chat && this.props.chat.messages) {
            messages = this.props.chat.messages;
        }
        console.log(this.props.chat);
        return (
            <div>
                <this.TopPanel />

                <div className="ms-body">
                    {/* <div className="message-feed received">
                        <img
                            src="https://bootdey.com/img/Content/avatar/avatar2.png"
                            alt=""
                            className="img-avatar"
                        />
                    </div> */}
                    <ul>{messages && this.renderMessages(messages)}</ul>
                </div>

                <div className="pull-left">
                    <img
                        src="https://bootdey.com/img/Content/avatar/avatar1.png"
                        alt=""
                        className="img-avatar"
                    />
                </div>

                <div className="msb-reply">
                    <form onSubmit={this.sendMessage}>
                        <textarea
                            placeholder="Enter message"
                            onChange={this.changeCurrentInput}
                        >
                            {this.state.input}
                        </textarea>
                        <i
                            className="fa fa-paperclip attachment"
                            aria-hidden="true"
                        ></i>
                        <button
                            className="submit"
                            // onClick={this.sendMessage}
                            // value={this.state.input}
                        >
                            <i className="fa fa-paper-plane-o"></i>
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

//Adding redux state as props to this component
const mapStateToProps = (state, ownProps) => {
    return {
        // currentUser: state.currentUser,
        //messages need to be retreieved dynamically for each rendering
        // unlike chatID. Redux suits
        // messages: state.chats[ownProps.chatID].messages,

        //************** */
        //only for now!!
        chat: state.chat.chats[ownProps.chatID],

        // messages: state.chat.chats[ownProps.chatID]
        //     ? state.chat.chats[ownProps.chatID].messages
        //     : [],

        currentUser: state.auth.currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addMessage: (chatID, message) => {
            return dispatch(chatActions.addMessage(chatID, message));
        },
        loadMessages: (chatID, messages) => {
            return dispatch(chatActions.loadMessages(chatID, messages));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
