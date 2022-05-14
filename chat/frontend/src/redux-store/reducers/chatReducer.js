import axios from "axios";
import * as actionTypes from "../actions/actionTypes";
import * as messageActions from "../actions/messageActions";
const initialState = {
    chats: localStorage.token ? localStorage.token : [],
    //currenetUser is user account object of django (Not User model)
    currentUser: localStorage.currentUser ? localStorage.currentUser : null,
    //While waiting for response from the backend, shows that circle thingy
    loading: false,
    error: false,
};

export default reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SUCCESS:
            return state;
            break;
        default:
            return state;
    }
};
