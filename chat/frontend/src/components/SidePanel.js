import React from "react";
import {connect} from "react-redux";
import * as chatActions from "../redux-store/actions/chatActions";
import * as authActions from "../redux-store/actions/authActions";
import {Drawer, Popover, Button, Segmented} from "antd";
import ChatPrompter from "./ChatPrompter";
import AddFriendPrompter from "./AddFriendPrompter";
import {FriendRequestList, FriendList} from "./Lists";
export const FRIENDS = "FRIENDS";
export const FRIEND_REQUESTS = "FRIEND_REQUESTS";
export const CHATS = "CHATS"
class SidePanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chatPrompterOpen: false,
			addFriendPrompterOpen: false,
			friendRequestsVisible: false,
			friendsVisible: false,
			listOption: FRIENDS
		};
	}
	openAddFriendPrompter = () => {
		this.setState({
			addFriendPrompterOpen: true,
		});
	};
	closeAddFriendPrompter = () => {
		console.log("Called");
		this.setState({
			addFriendPrompterOpen: false,
		});
	};

	openChatPrompter = () => {
		this.setState({
			chatPrompterOpen: true,
		});
	};
	closeChatPrompter = () => {
		this.setState({
			chatPrompterOpen: false,
		});
	};
	getUserNamesTrimmed = (usernames) => {
		if (usernames) {
			const trimmed = usernames.map((user, index) => {
				if (index < usernames.length - 1) {
					return usernames[index] + ", ";
				} else {
					return usernames[index];
				}
			});
			return trimmed;
		}
	};
	chatSelectionHandler = (event) => {
		const chatID = event.target.value;
		this.props.selectChat(chatID);
	};

	createChatHandler = (event) => {
		this.props.createChat(event.target.value);
	};

	addFriend = (event) => {
		this.props.addFriend(event.target.value);
	};

	FriendListDrawer = (props) => {

		const showDrawer = () => {props.changeVisibility(true)}

		const onChange = (e) => {
			setPlacement(e.target.value);
		};

		const onClose = () => {
			props.changeVisibility(false)
		}
		return (<Drawer
			title="Friends"
			placement={"left"}
			width={400}
			onClose={onClose}
			visible={props.visible}
			extra={
				<div>
					<Button onClick={onClose}>Cancel</Button>
					<Button type="primary" onClick={onClose}>
						OK
					</Button>
				</div>
			}
		><FriendList />      </Drawer>

		)
	}

	FriendRequestListDrawer = (props) => {
		const showDrawer = () => {props.changeVisibility(true)}

		const onChange = (e) => {
			setPlacement(e.target.value);
		};

		const onClose = () => {props.changeVisibility(false)}
		return (<Drawer
			title="Friend Requests"
			placement="left"
			width={400}
			onClose={onClose}
			visible={props.visible}
			extra={
				<div>
					<Button onClick={onClose}>Cancel</Button>
					<Button type="primary" onClick={onClose}>
						OK
					</Button>
				</div>
			}
		>     <FriendRequestList /></Drawer>
		)
	}
	renderChats = () => {
		const chats = this.props.chats;
		const chats_rendered = Object.keys(chats).map((chatID, index) => {
			const chat = {...chats[chatID]};
			const messages = chats[chatID] ? [...chats[chatID].messages] : [];
			const usernames = [...this.getUserNamesTrimmed(chat["participants"])];
			const latestMessage = (messages && (messages.length > 0) && messages.reverse() && messages[0] != undefined) ? messages[0].content : "";
			return (
				<div className="list-group-item media" key={chatID}>
					{/* <a className="list-group-item media" href={""} key={chatID}> */}
					<div className="pull-left">
						<img
							style={{width: "100%"}}
							src="https://bootdey.com/img/Content/avatar/avatar2.png"
							alt=""
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
						<small className="list-group-item-text c-gray" key={chatID}>
							{latestMessage}
						</small>
					</div>
				</div>
			);
		});
		return chats_rendered;
	};

	render = () => {
		const customStyles = {
			content: {
				top: "50%",
				left: "50%",
				right: "auto",
				bottom: "auto",
				marginRight: "-50%",
				transform: "translate(-50%, -50%)",
			},
		};
		return (
			<div id="sidepanel">
				<this.FriendRequestListDrawer changeVisibility={(val) => {this.setState({friendRequestsVisible: val})}} visible={this.state.friendRequestsVisible} />
				<this.FriendListDrawer changeVisibilit={(val) => {this.setState({friendsVisible: val})}} visible={this.state.friendsVisible} />
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
								<button className="friendsRequestButton" onClick={() => {this.setState({friendRequestsVisible: true})}}>
									<i className="fa-solid fa-user-plus"></i>
								</button>
								<button
									className="logoutButton"
									type="text"
									onClick={this.props.logout}
								>
									LOGOUT
								</button>
							</div>
						</div>
						<div className="p-15">
							<button
								className="btn btn-primary btn-block"
								type="text"
								onClick={this.openChatPrompter}
							>
								New Chat
							</button>
							{/* <div> */}
							<Popover
								content={
									<div>
										<ChatPrompter
											createHandler={(friends) => {
												const participants = [
													...friends,
													this.props.currentUser,
												];
												this.props.createChat(participants);
												this.closeChatPrompter();
											}}
											friends={this.props.friends}
										/>
										<a
											style={{
												position: "absolute",
												top: "80%",
												right: "0%",
												transform: "translateX(-50%)",
											}}
											onClick={this.closeChatPrompter}
										>
											Close
										</a>
									</div>
								}
								title="Who do you want to invite?"
								trigger="click"
								visible={this.state.chatPrompterOpen}
							></Popover>
						</div>

						<div className="p-15">
							<button
								className="btn btn-primary btn-block"
								type="text"
								onClick={this.openAddFriendPrompter}
							>
								Add a friend
							</button>
							<Popover
								content={
									<div>
										<AddFriendPrompter />
										<a
											style={{
												position: "absolute",
												top: "90%",
												right: "0%",
												transform: "translateX(-50%)",
											}}
											onClick={this.closeAddFriendPrompter}
										>
											Close
										</a>
									</div>
								}
								trigger="click"
								visible={this.state.addFriendPrompterOpen}
							></Popover>
						</div>

						<div className="p-15" id="dropdown">
							<div className="dropdown">
								<a
									className="btn btn-primary btn-block"
									href=""
									data-toggle="dropdown"
									id="dropdown"
								>
									Search ... <i className="caret m-l-5"></i>
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
											<i className="fa fa-users"></i> Contacts
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

						<div><Segmented options={[FRIENDS, CHATS]} value={this.state.listOption} onChange={(value) => {this.setState({listOption: value})}} />


							{this.state.listOption === FRIENDS ? <FriendList /> : <div className="list-group lg-alt">{this.renderChats()}</div>}</div>

						{/*<div className="list-group lg-alt">{this.renderChats()}</div>*/}
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
		// friends: state.auth.friends,
		friends: state.account.friends,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		selectChat: (chatID) => {
			return dispatch(chatActions.selectChat(chatID));
		},
		logout: () => {
			dispatch(authActions.logoutAction);
			dispatch(chatActions.selectChat(null));
		},
		createChat: (participants) => {
			dispatch(chatActions.createChatAction(participants));
		},
		addFriend: (friend) => {
			dispatch();
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
