import * as actionTypes from "./actionTypes";

import axios from "axios";

//********************* */
axios.defaults.baseURL = "http://127.0.0.1:8000/account/api/";
const serverAddress = "http://127.0.0.1:8000/account/api";
export const sendFriendRequestAction = (requester, receiver) => {
  return (dispatch) => {
    axios
      .post(
        "http://127.0.0.1:8000/account/api/friend-requests/",
        {
          requester: requester,
          receiver: receiver,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        //console.log(response.data);
      });
  };
};

export const sendInvitationResponse = (requestID, response) => {
  return (dispatch) => {
    axios.patch(
      `${serverAddress}/friend-requests/${requestID}/`,
      { op: "replace", field: "accepted", value: response },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
  };
};

export const loadFriends = (friends) => {
  localStorage.setItem("friends", JSON.stringify(friends));
  return {
    type: actionTypes.LOAD_FRIENDS,
    friends: [...friends],
  };
};
export const loadFriendsAction = (username) => {
  return (dispatch, getState) => {
    axios
      .get(`http://127.0.0.1:8000/account/api/friends?userID=${username}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        data: {
          username: username,
        },
      })
      .then((response) => {
        dispatch(loadFriends(response.data));
        // axios.defaults.baseURL = "http://127.0.0.1:8000/api-auth/";
      });
  };
};
export const friendRequestReceivedAction = (friendRequest) => {
  var existing = localStorage.getItem("friendRequests");

  var stored_requests = existing == null ? [] : JSON.parse(existing);
  localStorage.setItem(
    "friendRequests",
    JSON.stringify([...stored_requests, friendRequest])
  );
  return (dispatch) => {
    dispatch({
      type: actionTypes.FRIEND_REQUEST_RECEIVED,
      friendRequest: friendRequest,
    });
  };
};

export const friendAddedAction = (friend) => {
  var existing = localStorage.getItem("friends");
  var stored_friends = existing == null ? [] : JSON.parse(existing);
  localStorage.setItem("friends", JSON.stringify([...stored_friends, friend]));
  return (dispatch) => {
    dispatch({
      type: actionTypes.FRIEND_ADDED,
      friend: friend,
    });
  };
};
