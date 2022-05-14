import React from "react";
import socketServerInstance from "../websocket";
import { connect } from "react-redux";
import * as actions from "../redux-store/actions/authActions";

//The user authentication must be global. => redux
//Chat component is react-based chat UI for each chat room. ChatID doesn't have to be global.
//ChatID is an instance-specific prop
//
class ChatRoom extends React.Component {
    buildConnection = (chatID) => {
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
            }
        }, 200);
    };
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message: "",
        };

        this.state.path = window.location.pathname;
        let chatID = this.state.path.split("/chat/").pop();
        this.buildConnection(chatID);
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

    renderMessages(messages) {
        const messages_rendered = messages.map((message) => {
            <li
                key={message.messageID}
                className={message.author === currentUser ? "sent" : "replies"}
            />;
            <p>
                {message.content}
                <br />
                <small
                    className={
                        message.author === currentUser ? "sent" : "replies"
                    }
                >
                    {this.renderTimestamp(message.timestamp)}
                </small>
            </p>;
        });
        return <ul></ul>;
    }

    render() {
        return (
            <div>
                <this.TopPanel />
                <div className="ms-body">
                    <div className="message-feed right">
                        <div className="pull-right">
                            <img
                                src="https://bootdey.com/img/Content/avatar/avatar2.png"
                                alt=""
                                className="img-avatar"
                            />
                        </div>
                        <div className="media-body">
                            <div className="mf-content">I am hungry</div>
                            <small className="mf-date">
                                <i className="fa fa-clock-o"></i> 20/02/2015 at
                                09:30
                            </small>
                        </div>
                    </div>

                    <div className="message-feed media">
                        <div className="pull-left">
                            <img
                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                alt=""
                                className="img-avatar"
                            />
                        </div>
                        <div className="media-body">
                            <div className="mf-content">Let's have pizza</div>
                            <small className="mf-date">
                                <i className="fa fa-clock-o"></i> 20/02/2015 at
                                09:33
                            </small>
                        </div>
                    </div>

                    <div className="msb-reply">
                        <textarea placeholder="What's on your mind..."></textarea>
                        <button>
                            <i className="fa fa-paper-plane-o"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

//Adding redux state as props to this component
const mapStateToProps = (state, ownProps) => {
    return {
        currentUser: state.currentUser,
        //messages need to be retreieved dynamically for each rendering
        // unlike chatID. Redux suits
        // messages: state.message.messages,
        // messages: state.chats[ownProps.chatID].messages,
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
export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
