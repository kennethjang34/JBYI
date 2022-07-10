import React, { useRef, useEffect, useState } from "react";
import "antd/dist/antd.css";
// import "./index.css";
import { Select, Button, Divider } from "antd";
const { Option } = Select;

let toInvite = [];
const addFriend = (value) => {
    if (value) {
        toInvite.push(value);
    }
};
const removeFriend = (value) => {
    if (value) {
        toInvite = toInvite.filter(function(item) {
            return item !== value;
        });
    }
};
const renderFriends = (friends) => {
    if (friends) {
        const friendsRendered = friends.map((friend) => {
            return (
                <Option
                    value={friend.userID}
                    label={friend.userID}
                    key={friend.userID}
                >
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
    } else {
        return null;
    }
};

const Test = (props) => {
    <div>
        <div>aaa</div>
        abcd
    </div>;
};
const ChatPrompter = (props) => {
    const [open, setOpen] = useState(false);
    const selectRef = useRef();
    return (
        <div>
            <Select
                ref={selectRef}
                mode="multiple"
                onFocus={() => {
                    setOpen(true);
                }}
                open={open}
                style={{
                    width: "100%",
                }}
                onBlur={() => {
                    setOpen(false);
                }}
                placeholder="select people to invite"
                onSearch={() => {
                    setOpen(true);
                }}
                onSelect={(value) => {
                    addFriend(value);
                    setOpen(false);
                }}
                onDeselect={removeFriend}
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
