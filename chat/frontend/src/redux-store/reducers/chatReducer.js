import axios from "axios";
import * as actionTypes from "../actions/actionTypes";
import * as messageActions from "../actions/chatActions";
const initialState = {
    chats: localStorage.chats ? localStorage.chats : {},
    //currenetUser is user account object of django (Not User model)
    currentUser: localStorage.currentUser ? localStorage.currentUser : null,
    selected: "abc",
    //While waiting for response from the backend, shows that circle thingy
    loading: false,
    error: false,
};

const addMessage = (state, action) => {
    const chat = state[action.chatID];
    const messages = [...chat.messages, action.message];
    const chats = { ...state.chats };
    chats[action.chatID] = { messages: messages };
    return { ...state, chats: chats };
};

const loadMessages = (state, action) => {
    const chats = { ...state.chats };
    chats[action.chatID] = { messages: action.messages };
    console.log({ ...state, chats: { ...chats } });
    return { ...state, chats: { ...chats } };
};

const selectChat = (state, action) => {
    return { ...state, selected: action.selectedChatID };
};

// const messageReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case actionTypes.LOAD_MESSAGE:
//             return loadMessages(state, action);
//         case actionTypes.ADD_MESSAGE:
//             return addMessage(state, action);
//         default:
//             return state;
//     }
// };

export default reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_MESSAGES:
            return loadMessages(state, action);
        case actionTypes.ADD_MESSAGE:
            return addMessage(state, action);
        case actionTypes.SELECT_CHAT:
            return selectChat(state, action);
        default:
            return state;
    }
};
