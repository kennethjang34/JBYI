import React, {useState} from "react";
import {connect} from "react-redux";
import * as accountActions from "../redux-store/actions/accountActions";
import {Avatar, Input, AutoComplete, Button} from "antd";
import {Avatar, Popover, List} from 'antd';

export const FriendListComponent = (props) => (
	<List
		itemLayout="horizontal"
		dataSource={props.friends ? props.friends : []}
		renderItem={(item) => (
			<List.Item>
				<List.Item.Meta
					avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
					title={<span>{`${item.userID}`}</span>}
				/>
			</List.Item>
		)}
	/>
);
export const FriendRequestListComponent = (props) => {
	return (< List
		itemLayout="horizontal"
		dataSource={props.friendRequests ? props.friendRequests : []}

		renderItem={(item) => {
			if (item.sent || item.requester === props.currentUser) {
				let accepted = item.accepted;
				if (accepted === true || accepted === false) {
					return (
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
								title={<span>{`Friend Request to: ${item.receiver}!`}</span>}
								description={accepted ? "Accepted" : "Declined"}
							/>
						</List.Item >
					)
				} else {
					return (
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
								title={<span>{`Friend Request to: ${item.receiver}!`}</span>}
								description={<div>Sent </div>}
							/>
						</List.Item>
					)
				}


			} else {
				let accepted = item.accepted;
				if (accepted === true || accepted === false) {
					return (
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
								title={<span>{`Friend Request from: ${item.requester}!`}</span>}
								description={accepted ? "Accepted" : "Declined"}
							/>
						</List.Item >
					)
				} else {
					return (
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
								title={<span>{`Friend Request from: ${item.requester}!`}</span>}
								description={<div><Button onClick={() => {props.acceptFriendRequest(item.id)}}>Accept</Button><Button onClick={() => {props.declineFriendRequest(item.id)}}>Decline</Button></div>}
							/>
						</List.Item>
					)
				}
			}
		}
		} />
	)
}
const mapStateToProps = (state) => {
	return {
		currentUser: state.auth.currentUser,
		friends: state.account.friends,
		friendRequests: state.account.friendRequests
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		acceptFriendRequest: (id) => {
			dispatch(
				accountActions.sendInvitationResponse(id, true))
		},
		declineFriendRequest: (id) => {dispatch(accountActions.sendInvitationResponse(id, false))}
	}
}



const FriendList = connect(mapStateToProps, mapDispatchToProps)(FriendListComponent);
const FriendRequestList = connect(mapStateToProps, mapDispatchToProps)(FriendRequestListComponent);
export {FriendList, FriendRequestList}

