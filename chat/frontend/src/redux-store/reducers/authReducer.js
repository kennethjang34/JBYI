import axios from "axios";
import * as actionTypes from "../actions/actionTypes";
import * as authActions from "../actions/authActions";
const initialState = {
    token: localStorage.token ? localStorage.token : null,
    //currenetUser is user account object of django (Not User model)
    currentUser: localStorage.currentUser ? localStorage.currentUser : null,
    //While waiting for response from the backend, shows that circle thingy
    loading: false,
    error: false,
};

const login_success = (state, action) => {
    return {
        ...state,
        token: action.token,
        currentUser: action.currentUser,
        loading: false,
        error: null,
    };
};

const login_fail = (state, action) => {
    return {
        ...state,
        token: null,
        currentUser: null,
        loading: false,
        error: action.error,
    };
};

const login_start = (state, action) => {
    return {
        ...state,
        error: null,
        loading: true,
    };
};

const logout = (state, action) => {
    return {
        ...state,
        token: null,
        currentUser: null,
    };
};

export default reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_START:
            return login_start(action, state);
        case actionTypes.AUTH_SUCCESS:
            return login_success(action, state);
        case actionTypes.AUTH_FAIL:
            return login_fail(action, state);
        case actionTypes.LOGOUT:
            return logout(action, state);
        default:
            return state;
    }
};
