import axios from "axios";
import * as actionTypes from "../actions/actionTypes";
const initialState = {
  token: localStorage.token ? localStorage.token : null,
  currentUser: localStorage.currentUser ? localStorage.currentUser : null,
  //While waiting for response from the backend, shows that circle thingy
  loading: false,
  error: false,
};

const login_success = (state, action) => {
  // console.log(action.currentUser);
  return {
    ...state,
    token: action.token,
    currentUser: action.currentUser,
    friends: null,
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

const auth_start = (state, action) => {
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

const load_friends = (state, action) => {
  return {
    ...state,
    friends: action.friends,
  };
};

export default reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return auth_start(state, action);
    case actionTypes.LOGIN_SUCCESS:
      return login_success(state, action);
    case actionTypes.LOGIN_FAIL:
      return login_fail(state, action);
    case actionTypes.LOGOUT:
      return logout(state, action);
    case actionTypes.LOAD_FRIENDS:
      return load_friends(state, action);
    default:
      return state;
  }
};
