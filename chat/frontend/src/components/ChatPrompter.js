
import React, {useRef, useEffect, useState} from "react";
import "antd/dist/antd.css";
// import "./index.css";
import {Select, Button, Divider} from "antd";
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
	const [open, setOpen] = useState(true)
	const selectRef = useRef()
	dropdownRender = (menu) => {
		return (!open ? null : <>{menu}
			<Button onClick={() => {toInvite && props.createHandler(toInvite); setOpen(false); selectRef.current.blur()}}>Create Chat</Button></>)
	}
	//	useEffect(() => {if (props.visible) {setOpen(true)} })
	//	useEffect(() => {console.log(selectRef.current); selectRef.current.blur()}, [open])
	return (
		<div>
			<Select
				ref={selectRef}
				mode="multiple"
				onFocus={() => {setOpen(true)}}
				open={open}
				style={{
					width: "100%",
				}}
				placeholder="select people to invite"
				onSelect={addFriend}
				onDeselect={removeFriend}
				dropdownRender={(menu) => {return !open ? null : (<>{menu}<Button onClick={() => {toInvite && props.createHandler(toInvite); setOpen(false); selectRef.current.blur()}}>Create Chat </Button></>)}}>
				{props.friends && renderFriends(props.friends)}
			</Select >
			<Button
				onClick={() => {
					toInvite && props.createHandler(toInvite);
				}}
			>
				Create Chat
			</Button>
		</div >
	);
};

export default ChatPrompter;
