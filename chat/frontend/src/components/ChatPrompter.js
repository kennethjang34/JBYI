import React from "react";
import "antd/dist/antd.css";
// import "./index.css";
import {Select, Button} from "antd";
const {Option} = Select;

let toInvite = [];
const addFriend = (value) => {
	if (value) {
		toInvite.push(value);
	}
};
const removeFriend = (value) => {
	if (value) {
		toInvite = toInvite.filter(function (item) {
			return item !== value;
		});
	}
};
const renderFriends = (friends) => {
	const friendsRendered = friends.map((friend) => {
		return (
			<Option value={friend.userID} label={friend.userID} key={friend.userID}>
				<div className="demo-option-label-item">
					<span role="img" aria-label={friend.userID}>
						😀
					</span>
					{" " + friend.userID}
				</div>
			</Option>
		);
	});
	return friendsRendered;
};

const ChatPrompter = (props) => {
	return (
		<div>
			<Select
				mode="multiple"
				style={{
					width: "100%",
				}}
				placeholder="select people to invite"
				// defaultValue={["china"]}
				onSelect={addFriend}
				onDeselect={removeFriend}
			// optionlabelprop="label"
			>
				{props.friends && renderFriends(props.friends)}
			</Select>
			<Button
				onClick={() => {
					toInvite && props.createHandler(toInvite);
				}}
			>
				Create Chat
			</Button>
		</div>
	);
};

export default ChatPrompter;
