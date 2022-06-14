import axios from "axios";
import * as actionTypes from "../actions/actionTypes";
const initialState = {
  friends: localStorage.friends ? localStorage.friends : [],
};

const friendAdded = (state, action) => {
  const friends = [...state.friends, action.friend];
  return { ...state, friends: friends };
};

const friendRequestReceived = (state, action) => {
  console.log(action.friendRequest);
  return {
    ...state,
    friendRequests: [...state.friendRequests, action.friendRequest],
  };
};
export default reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FRIEND_ADDED:
      return friendAdded(state, action);
    case actionTypes.FRIEND_REQUEST_RECEIVED:
      return friendRequestReceived(state, action);
    default:
      return state;
  }
};
