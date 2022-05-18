import React from "react";
import { connect } from "react-redux";
import * as chatActions from "../redux-store/actions/chatActions";
import * as authActions from "../redux-store/actions/authActions";

class SidePanel extends React.Component {
    getUserNamesTrimmed = (users) => {
        const usernames = users.map((user, index) => {
            if (index < users.length - 1) {
                return user.userID + ", ";
            } else {
                return user.userID;
            }
        });
        return usernames;
    };

    chatSelectionHandler = (event) => {
        const chatID = event.target.value;
        this.props.selectChat(chatID);
    };

    renderChats = () => {
        const chats = this.props.chats;
        const chats_rendered = Object.keys(chats).map((chatID, index) => {
            const chat = chats[chatID];
            const usernames = [
                ...this.getUserNamesTrimmed(chat["participants"]),
            ];

            return (
                <div className="list-group-item media" key={chatID}>
                    {/* <a className="list-group-item media" href={""} key={chatID}> */}
                    <div className="pull-left">
                        <img
                            src="https://bootdey.com/img/Content/avatar/avatar2.png"
                            alt=""
                            className="img-avatar"
                        />
                    </div>
                    <div className="media-body">
                        <button
                            className="link"
                            onClick={this.chatSelectionHandler}
                            value={chatID}
                        >
                            {/* <button className="list-group-item-heading"> */}
                            {usernames}
                        </button>
                        <small
                            className="list-group-item-text c-gray"
                            key={chatID}
                        >
                            {chat &&
                            chat.messages &&
                            chat.messages.length > 0 &&
                            chat.messages.reverse()
                                ? chat.messages.reverse()[0].content
                                : ""}
                        </small>
                    </div>
                </div>
            );
        });
        return chats_rendered;
    };

    render = () => {
        return (
            <div id="sidepanel">
                {/* //  <div className="container bootstrap snippets bootdey"> */}
                <div className="tile tile-alt" id="messages-main">
                    <div className="ms-menu">
                        <div className="ms-user clearfix" id="profile">
                            <img
                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                alt=""
                                className="img-avatar pull-left"
                            />
                            <div>
                                Signed in as <br />
                                {this.props.currentUser}
                                <button
                                    className="logoutButton"
                                    // href=""
                                    type="text"
                                    onClick={this.props.logout}
                                >
                                    LOGOUT
                                </button>
                            </div>
                        </div>

                        <div className="p-15" id="dropdown">
                            <div className="dropdown">
                                <a
                                    className="btn btn-primary btn-block"
                                    href=""
                                    data-toggle="dropdown"
                                    id="dropdown"
                                >
                                    New Chat <i className="caret m-l-5"></i>
                                </a>

                                <ul className="dropdown-menu dm-icon w-100">
                                    <li>
                                        <a href="" id="messages">
                                            <i className="fa fa-envelope"></i>
                                            Messages
                                        </a>
                                    </li>
                                    <li>
                                        <a href="" id="contacts">
                                            <i className="fa fa-users"></i>{" "}
                                            Contacts
                                        </a>
                                    </li>
                                    <li>
                                        <a href="" id="todos">
                                            <i className="fa fa-format-list-bulleted"></i>
                                            Todo Lists
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="list-group lg-alt">
                            {this.renderChats()}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.currentUser,
        chats: state.chat.chats,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        selectChat: (chatID) => {
            return dispatch(chatActions.selectChat(chatID));
        },
        logout: () => {
            // navigate.push("/login");
            dispatch(authActions.logoutAction);
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
