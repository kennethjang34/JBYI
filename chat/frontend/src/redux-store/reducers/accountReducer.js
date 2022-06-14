import axios from "axios";
import * as actionTypes from "../actions/actionTypes";
const initialState = {
  friends: localStorage.friends ? localStorage.friends : [],
};

const friendAdded = (state, action) => {
  const friends = [...state, action.friend];
  return { ...state, friends: friends };
};

export default reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FRIEND_ADDED:
      return friendAdded(state, action);
    default:
      return state;
  }
};
