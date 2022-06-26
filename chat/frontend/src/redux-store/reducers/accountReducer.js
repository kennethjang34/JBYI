import axios from "axios";
import * as actionTypes from "../actions/actionTypes";
const initialState = {
  friends: localStorage.friends ? JSON.parse(localStorage.friends) : [],
};

const friendAdded = (state, action) => {
  const friends = [...state.friends, action.friend];
  return { ...state, friends: friends };
};

const friendRequestReceived = (state, action) => {
  friendRequests = state.friendRequests
    ? [...state.friendRequests, action.friendRequest]
    : [action.friendRequest];
  return {
    ...state,
    friendRequests: [...friendRequests],
  };
};

const loadFriends = (state, action) => {
  return {
    ...state,
    friends: action.friends,
  };
};
const logout = (state, action) => {
  localStorage.removeItem("friends");
  return {
    ...state,
    friends: null,
  };
};
export default reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FRIEND_ADDED:
      return friendAdded(state, action);
    case actionTypes.FRIEND_REQUEST_RECEIVED:
      return friendRequestReceived(state, action);
    case actionTypes.LOAD_FRIENDS:
      return loadFriends(state, action);

    case actionTypes.LOGOUT:
      return logout(state, action);
    default:
      return state;
  }
};
