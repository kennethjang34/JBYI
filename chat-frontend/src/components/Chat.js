import React from "react";
import WebSocketServer from "../websocket";
import { connect } from "react-redux";
import * as actions from "../redux-store/actions/authActions";

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

    TopPanel(props) {
        return (
            <div class="action-header clearfix">
                <div class="visible-xs" id="ms-menu-trigger">
                    <i class="fa fa-bars"></i>
                </div>

                <div class="pull-left hidden-xs">
                    <img
                        src="https://bootdey.com/img/Content/avatar/avatar2.png"
                        alt=""
                        class="img-avatar m-r-10"
                    />
                    <div class="lv-avatar pull-left"></div>
                    <span>David Parbell</span>
                </div>

                <ul class="ah-actions actions">
                    <li>
                        <a href="">
                            <i class="fa fa-trash"></i>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i class="fa fa-check"></i>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i class="fa fa-clock-o"></i>
                        </a>
                    </li>
                    <li class="dropdown">
                        <a href="" data-toggle="dropdown" aria-expanded="true">
                            <i class="fa fa-sort"></i>
                        </a>

                        <ul class="dropdown-menu dropdown-menu-right">
                            <li>
                                <a href="">Latest</a>
                            </li>
                            <li>
                                <a href="">Oldest</a>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="" data-toggle="dropdown" aria-expanded="true">
                            <i class="fa fa-bars"></i>
                        </a>

                        <ul class="dropdown-menu dropdown-menu-right">
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

    render() {
        return (
            <div class="ms-body">
                <this.TopPanel />
                <div class="message-feed right">
                    <div class="pull-right">
                        <img
                            src="https://bootdey.com/img/Content/avatar/avatar2.png"
                            alt=""
                            class="img-avatar"
                        />
                    </div>
                    <div class="media-body">
                        <div class="mf-content">I am hungry</div>
                        <small class="mf-date">
                            <i class="fa fa-clock-o"></i> 20/02/2015 at 09:30
                        </small>
                    </div>
                </div>

                <div class="message-feed media">
                    <div class="pull-left">
                        <img
                            src="https://bootdey.com/img/Content/avatar/avatar1.png"
                            alt=""
                            class="img-avatar"
                        />
                    </div>
                    <div class="media-body">
                        <div class="mf-content">Let's have pizza</div>
                        <small class="mf-date">
                            <i class="fa fa-clock-o"></i> 20/02/2015 at 09:33
                        </small>
                    </div>
                </div>

                <div class="msb-reply">
                    <textarea placeholder="What's on your mind..."></textarea>
                    <button>
                        <i class="fa fa-paper-plane-o"></i>
                    </button>
                </div>
            </div>
        );
    }
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
