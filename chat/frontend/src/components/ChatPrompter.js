import React from "react";
import "antd/dist/antd.css";
// import "./index.css";
import { Select, Button } from "antd";
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
};

const ChatPrompter = (props) => {
    return (
        <div style={{ width: "100%", height: "100%" }}>
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
                style={{
                    position: "absolute",
                    transform: "translateX(-50%)",
                    left: "50%",
                    top: "40%",
                }}
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

// const mapStateToProps = (state, ownProps) => {
//     return {
//         chats: state.chat.chats,

//         currentUser: state.auth.currentUser,
//     };
// };
