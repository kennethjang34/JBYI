import * as actionTypes from "../actions/actionTypes";
import axios from "axios";

// axios.defaults.baseURL = "http://127.0.0.1:8000/chat/api/";

export const addMessage = (chatID, message) => {
    return {
        type: actionTypes.ADD_MESSAGE,
        chatID: chatID,
        message: message,
    };
};

export const loadMessages = (chatID, messages) => {
    return {
        type: actionTypes.LOAD_MESSAGES,
        chatID: chatID,
        messages: messages,
    };
};

export const loadChats = (chats) => {
    const trimmedChats = {};
    console.log(chats);
    chats.map((chat) => {
        trimmedChats[chat.chatID] = chat;
    });
    console.log(chats);
    return {
        type: actionTypes.LOAD_CHATS,
        chats: trimmedChats,
    };
};

export const selectChat = (chatID) => {
    return {
        type: actionTypes.SELECT_CHAT,
        chatID: chatID,
    };
};

export const chatLoadError = (message) => {
    return {
        type: actionTypes.CHAT_LOAD_ERROR,
    };
};

export const getChatsAction = (currentUser) => {
    console.log("getChatsCalled");
    return (dispatch) => {
        axios
            .get("http://127.0.0.1:8000/chat/api/", {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
                data: {
                    username: currentUser,
                },
            })
            .then((response) => {
                console.log(response.data);
                dispatch(loadChats(response.data));
            })
            .catch((err) => {
                dispatch(chatLoadError(err.message));
            });
    };
};

export const createChatAction = (participants) => {
    return (dispatch) => {
        axios
            .post(
                "http://127.0.0.1:8000/chat/api/create/",
                {
                    // participants: ["admin", "jang"],
                    // participants: participants,
                },
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then((response) => {
                dispatch(chatCreated(response.data));
            })
            .catch((err) => {
                dispatch(chatLoadError(err.message));
            });
    };
};

export const chatCreated = (chat) => {
    return {
        type: actionTypes.CHAT_CREATED,
        chat: chat,
    };
};
