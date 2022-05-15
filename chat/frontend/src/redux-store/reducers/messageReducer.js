import * as actionTypes from "../actions/actionTypes";

const initialState = {
    messages: [],
};

const addMessage = (state, action) => {
    const messages = [...state.messages, action.message];
    state.messages = messages;
    return state;
};

const loadMessages = (state, action) => {
    state.messages = state.messages.reverse();
    return state;
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_MESSAGES:
            return loadMessages(state, action);
        case actionTypes.ADD_MESSAGE:
            return addMessage(state, action);
        default:
            return state;
    }
};

export default messageReducer;
