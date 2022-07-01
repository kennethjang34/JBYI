import React from "react";
import {WebSocketServer} from "../websocket";
import {connect} from "react-redux";
import * as authActions from "../redux-store/actions/authActions";
import * as chatActions from "../redux-store/actions/chatActions";
import * as accountActions from "../redux-store/actions/accountActions";
import ChatRoom from "./ChatRoom";
import SidePanel from "./SidePanel";
import {Outlet} from "react-router-dom";
import {openInvitationNotification, TOP_RIGHT} from "./NotificationPopUp";
class ChatApp extends React.Component {
	buildConnection = (userToken) => {
		const serverInstance = WebSocketServer.getServerInstance(userToken);

		setTimeout(() => {
			if (serverInstance && serverInstance.isConnectionMade()) {
				console.log(`Connectionto chat: ${userToken} successfully made`);
				serverInstance.setMessageHandlers(
					userToken,
					this.props.loadMessages,
					this.props.addMessage,
					this.props.chatAdded,
					this.props.friendAdded,
					this.props.friendRequestReceived
				);
				Object.keys(this.props.chats).map((chatID) => {
					serverInstance.sendMessage(chatID, {
						request: "previous_messages",
						chatID: chatID,
					});
				});
			} else {
				console.log("waiting for socket connection");
				this.buildConnection(userToken);
			}
		}, 200);
	};

	constructor(props) {
		super(props);
		//Okay. Is the status of current user still valid?
		// props.checkAuth();

		this.buildConnection(props.token);
	}

	componentDidMount = () => {
		this.props.getChats(this.props.currentUser);
	};

	render() {
		return (
			<div>
				<SidePanel serverInstance={WebSocketServer.getServerInstance()} />
				{/* <div className="right"> */}
				{this.props.selected ? (
					<ChatRoom
						chatID={this.props.selected}
						serverInstance={WebSocketServer.getServerInstance()}
					/>
				) : (
					<Outlet />
				)}
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
		token: state.auth.token,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		checkAuth: () => dispatch(authActions.checkAuthAction),
		// logout: () => {
		//     // navigate.push("/login");
		//     dispatch(authActions.logoutAction);
		//     dispatch(chatActions.selectChat(null));
		// },
		getChats: (currentUser) =>
			dispatch(chatActions.getChatsAction(currentUser)),
		addMessage: (chatID, message) => {
			return dispatch(chatActions.addMessage(chatID, message));
		},
		loadMessages: (chatID, messages) => {
			return dispatch(chatActions.loadMessages(chatID, messages));
		},
		chatAdded: (chatID, participants) => {
			return dispatch(
				chatActions.chatAdded(
					chatID,
					participants.map((participant) => participant.userID)
				)
			);
		},
		friendRequestReceived: (friendRequest) => {
			openInvitationNotification(
				"New Friend Request",
				`${friendRequest.requester} wants to be your new friend!`,
				() => {
					return dispatch(
						accountActions.sendInvitationResponse(friendRequest.id, true)
					);
				},
				() => {
					return dispatch(
						accountActions.sendInvitationResponse(friendRequest.id, false)
					);
				},
				TOP_RIGHT
			);
			return dispatch(
				accountActions.friendRequestReceivedAction(friendRequest)
			);
		},
		friendAdded: (newFriendID) => {
			return dispatch(accountActions.friendAddedAction(newFriendID));
		},
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
