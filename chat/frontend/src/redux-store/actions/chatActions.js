import * as actionTypes from "../actions/actionTypes";
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

export const selectChat = (chatID) => {
    return {
        type: actionTypes.SELECT_CHAT,
        chatID: chatID,
    };
};
