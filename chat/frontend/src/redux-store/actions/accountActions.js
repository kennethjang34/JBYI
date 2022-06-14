import * as actionTypes from "./actionTypes";

import axios from "axios";

//********************* */
axios.defaults.baseURL = "http://127.0.0.1:8000/account/api/";

export const sendFriendRequestAction = (requester, receiver) => {
  return (dispatch) => {
    axios
      .post(
        "add-friend",
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

export const friendRequestReceivedAction = (friendRequest) => {
  var existing = localStorage.getItem("friendRequests");
  console.log("Existing: " + existing);

  var stored_requests = existing == null ? [] : JSON.parse(existing);
  localStorage.setItem(
    "friendRequests",
    JSON.stringify([...stored_requests, friendRequest])
  );
  console.log(JSON.parse(localStorage.getItem("friendRequests")));
  return (dispatch) => {
    console.log(friendRequest);
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
