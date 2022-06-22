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
      `${serverAddress}/friend-requests/${requestID}`,
      { op: "replace", path: "/accepted", value: true },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
  };
};
//serveraddress should be like ~~/account/api/friend-request?requester=A&receiver=B
//the axios then will send to the address a put request to update the accepted field of the request
export const answerFriendRequestAction = (response) => {
  axios.post(`${serverAddress}/`);
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
